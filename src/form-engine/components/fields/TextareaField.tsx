import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { TextareaFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { getValidationRules } from "../../utils/fieldValidation.js";

export const TextareaField: React.FC<TextareaFieldConfig> = ({
  name,
  label,
  placeholder,
  cols = 12,
  className,
  labelClassName,
  inputClassName,
  errorClassName,
  validation,
  rows = 4,
  showWhen,
  hideWhen,
  enableWhen,
  disableWhen,
}) => {
  const {
    register,
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

  // Evaluate visibility and enabled state
  const isVisible = useMemo(() => {
    const showField = showWhen?.field ? valueMap[showWhen.field] : undefined;
    const hideField = hideWhen?.field ? valueMap[hideWhen.field] : undefined;
    return shouldShowField(
      showWhen,
      hideWhen,
      showWhen ? showField : hideField
    );
  }, [showWhen, hideWhen, valueMap]);

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

  if (!isVisible) return null;

  const error = errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={name}
        className={cn(
          "block text-sm font-semibold text-gray-700",
          labelClassName
        )}
      >
        {label}
        {validation?.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={!isEnabled}
        {...register(name, validationRules)}
        className={cn(
          "w-full px-4 py-3 border-2 rounded-lg shadow-sm transition-all duration-200 resize-y",
          "focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none",
          "hover:border-gray-400",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200",
          !isEnabled && "bg-gray-100 cursor-not-allowed opacity-60",
          inputClassName
        )}
      />
      {error && (
        <p className={cn("text-sm text-red-600 font-medium", errorClassName)}>
          {error.message as string}
        </p>
      )}
    </div>
  );
};
