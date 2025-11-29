import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { NumberFieldConfig } from "../../types/index.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { getValidationRules } from "../../utils/fieldValidation.js";

export const NumberField: React.FC<NumberFieldConfig> = ({
  name,
  label,
  placeholder,
  cols = 12,
  className = "",
  min,
  max,
  step,
  validation,
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

  const watchFields = useMemo(() => {
    const fields = new Set<string>();
    [showWhen, hideWhen, enableWhen, disableWhen].forEach((condition) => {
      getWatchedFields(condition).forEach((field) => fields.add(field));
    });
    return Array.from(fields);
  }, [showWhen, hideWhen, enableWhen, disableWhen]);

  const watchedValues = watch(watchFields);

  const valueMap = useMemo(() => {
    const map: Record<string, unknown> = {};
    watchFields.forEach((field, index) => {
      map[field] = watchedValues[index];
    });
    return map;
  }, [watchFields, watchedValues]);

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
  const colSpan = `col-span-${cols}`;
  return (
    <div className={`${colSpan} ${className}`}>
      {" "}
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
      </label>{" "}
      <input
        id={name}
        type="number"
        placeholder={placeholder}
        disabled={!isEnabled}
        min={min}
        max={max}
        step={step}
        {...register(name, { valueAsNumber: true, ...validationRules })}
        className={`w-full px-4 py-2.5 text-sm border rounded-md bg-white text-gray-900 placeholder-gray-400 
          transition-colors duration-200
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          }
          ${isEnabled ? "" : "bg-gray-50 text-gray-500 cursor-not-allowed"}
          focus:outline-none`}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error.message as string}</p>
      )}
    </div>
  );
};
