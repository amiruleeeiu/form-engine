import React from "react";
import { useFormContext } from "react-hook-form";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import type { CheckboxFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import { getValidationRules } from "../../utils/fieldValidation.js";

export const CheckboxField: React.FC<CheckboxFieldConfig> = (props) => {
  const {
    name,
    label,
    checkboxLabel,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    validation,
  } = props;

  const { register } = useFormContext();

  // Use custom hook for all common field logic
  const { isVisible, isEnabled, error, colSpan, shouldShowError } =
    useFieldConfig(props);

  if (!isVisible) return null;
  return (
    <div className={cn(colSpan, className)}>
      <label
        className={cn(
          "block text-sm font-semibold text-gray-800 mb-3",
          labelClassName
        )}
      >
        {label}
      </label>
      <label className="flex items-center space-x-3 cursor-pointer py-4 transition-all duration-200">
        <input
          type="checkbox"
          disabled={!isEnabled}
          {...register(name, getValidationRules(validation))}
          className={cn(
            "w-5 h-5 text-blue-600 border-2 disabled:cursor-not-allowed",
            inputClassName
          )}
        />
        <span className="text-sm font-medium text-gray-800">
          {checkboxLabel || label}
        </span>
      </label>
      {shouldShowError && (
        <p
          className={cn(
            "mt-2 text-sm font-medium text-red-600 flex items-center",
            errorClassName
          )}
        >
          <span className="mr-1">⚠</span>
          {error.message as string}
        </p>
      )}
    </div>
  );
};
