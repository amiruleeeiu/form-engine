import { useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import type { BaseFieldConfig } from "../types/index.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../utils/conditionalLogic.js";
import { getValidationRules } from "../utils/fieldValidation.js";

/**
 * Custom hook to handle common field configuration logic
 * Consolidates conditional logic, validation, and state management
 */
export const useFieldConfig = (config: BaseFieldConfig) => {
  const {
    name,
    validation,
    showWhen,
    hideWhen,
    enableWhen,
    disableWhen,
    cols = 12,
  } = config;

  const {
    watch,
    setValue,
    getFieldState,
    formState: { errors, isSubmitted },
  } = useFormContext();

  // Track previous visibility state
  const prevVisibleRef = useRef<boolean | null>(null);

  // Watch current field value for error display logic
  const fieldValue = watch(name);

  // Get validation rules from field config
  const validationRules = useMemo(
    () => getValidationRules(validation),
    [validation]
  );

  // Get all fields that need to be watched for conditional logic
  const watchFields = useMemo(() => {
    const fields = new Set<string>();
    [showWhen, hideWhen, enableWhen, disableWhen].forEach((condition) => {
      getWatchedFields(condition).forEach((field) => fields.add(field));
    });
    return Array.from(fields);
  }, [showWhen, hideWhen, enableWhen, disableWhen]);

  // Watch the dependent fields
  const watchedValues = watch(watchFields);

  // Build a map of field values for evaluation
  const valueMap = useMemo(() => {
    const map: Record<string, unknown> = {};
    watchFields.forEach((field, index) => {
      map[field] = watchedValues[index];
    });
    return map;
  }, [watchFields, watchedValues]);

  // Evaluate visibility
  const isVisible = useMemo(() => {
    const showField = showWhen?.field ? valueMap[showWhen.field] : undefined;
    const hideField = hideWhen?.field ? valueMap[hideWhen.field] : undefined;
    return shouldShowField(
      showWhen,
      hideWhen,
      showWhen ? showField : hideField
    );
  }, [showWhen, hideWhen, valueMap]);

  // Evaluate enabled state
  const isEnabled = useMemo(() => {
    const enableField = enableWhen?.field
      ? valueMap[enableWhen.field]
      : undefined;
    const disableField = disableWhen?.field
      ? valueMap[disableWhen.field]
      : undefined;
    return shouldEnableField(
      enableWhen,
      disableWhen,
      enableWhen ? enableField : disableField
    );
  }, [enableWhen, disableWhen, valueMap]);

  // Get field error
  const { error } = getFieldState(name);

  // Calculate grid column span class
  const colSpan = `col-span-${cols}`;

  // Show error if form has been submitted or field has error
  const shouldShowError = !!error && isSubmitted;

  // Clear field value when it becomes hidden
  useEffect(() => {
    // Skip if no conditional visibility logic
    if (!showWhen && !hideWhen) return;

    // Skip on initial render
    if (prevVisibleRef.current === null) {
      prevVisibleRef.current = isVisible;
      return;
    }

    // If field was visible before and is now hidden, clear its value
    if (prevVisibleRef.current === true && isVisible === false) {
      setValue(name, null, { shouldValidate: false, shouldDirty: false });
    }

    // Update the previous visibility state
    prevVisibleRef.current = isVisible;
  }, [isVisible, name, setValue, showWhen, hideWhen]);

  return {
    validationRules,
    isVisible,
    isEnabled,
    error,
    colSpan,
    shouldShowError,
    fieldValue,
  };
};
