import { useMemo } from "react";
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
    formState: { errors },
  } = useFormContext();

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
  const error = errors[name];

  // Calculate grid column span class
  const colSpan = `col-span-${cols}`;

  return {
    validationRules,
    isVisible,
    isEnabled,
    error,
    colSpan,
  };
};
