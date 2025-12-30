import React from "react";
import { useFormContext } from "react-hook-form";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import type { RadioFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";

export const RadioField: React.FC<RadioFieldConfig> = (props) => {
  const {
    name,
    label,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    options,
    clearFields,
  } = props;

  const { register } = useFormContext();

  // Use custom hook for all common field logic
  const {
    validationRules,
    isVisible,
    isEnabled,
    error,
    colSpan,
    shouldShowError,
  } = useFieldConfig(props);

  if (!isVisible) return null;

  // Handle clearing dependent fields
  const handleChange = () => {
    if (clearFields && clearFields.length > 0) {
      clearFields.forEach((fieldName) => {
        setValue(fieldName, undefined, { shouldValidate: false });
      });
    }
  };

  return (
    <div className={cn(colSpan, className)}>
      <label
        className={cn(
          "block text-sm font-medium text-gray-700 mb-2",
          labelClassName
        )}
      >
        {label}
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2.5 cursor-pointer transition-colors duration-200"
          >
            <input
              type="radio"
              value={option.value}
              disabled={!isEnabled}
              {...register(name, validationRules)}
              onChange={(e) => {
                register(name, validationRules).onChange(e);
                handleChange();
              }}
              className={cn(
                "w-4 h-4 text-blue-600 border-gray-300 disabled:cursor-not-allowed",
                inputClassName
              )}
            />
            <span className="text-sm text-gray-900">{option.label}</span>
          </label>
        ))}
      </div>
      {shouldShowError && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {error.message as string}
        </p>
      )}
    </div>
  );
};
