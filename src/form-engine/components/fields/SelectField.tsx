import React from "react";
import { useFormContext } from "react-hook-form";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import type { SelectFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import { useDynamicOptions } from "../../utils/dynamicOptions.js";
import { FieldLabel } from "../core/FieldLabel.js";

export const SelectField: React.FC<SelectFieldConfig> = (props) => {
  const {
    name,
    label,
    placeholder,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    options: staticOptions = [],
    dynamicOptions,
    clearFields,
    validation,
  } = props;

  const { register, setValue } = useFormContext();
  const { options: dynamicOpts, loading } = useDynamicOptions(dynamicOptions);

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

  const options = dynamicOptions ? dynamicOpts : staticOptions;

  return (
    <div className={cn(colSpan, className)}>
      <FieldLabel
        htmlFor={name}
        label={label}
        required={!!validation?.required}
        className={labelClassName}
      />
      <select
        id={name}
        disabled={!isEnabled || loading}
        {...register(name, {
          ...validationRules,
          onChange: (e) => {
            const newValue = e.target.value;
            if (clearFields && clearFields.length > 0) {
              if (
                !newValue ||
                newValue === "" ||
                newValue === null ||
                newValue === undefined
              ) {
                console.log(
                  `Clearing dependent fields for ${name}:`,
                  clearFields
                );
                clearFields.forEach((fieldName) => {
                  setValue(fieldName, "", {
                    shouldValidate: false,
                    shouldDirty: true,
                  });
                });
              }
            }
          },
        })}
        className={cn(
          "w-full px-4 py-2.5 text-sm border rounded-md bg-white text-gray-900 transition-colors duration-200 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
          shouldShowError
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          inputClassName
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {loading && <option value="">Loading...</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {shouldShowError && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {error?.message as string}
        </p>
      )}
    </div>
  );
};
