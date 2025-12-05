import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { SelectFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { useDynamicOptions } from "../../utils/dynamicOptions.js";
import { getValidationRules } from "../../utils/fieldValidation.js";

export const SelectField: React.FC<SelectFieldConfig> = ({
  name,
  label,
  placeholder,
  cols = 12,
  className,
  labelClassName,
  inputClassName,
  errorClassName,
  options: staticOptions = [],
  dynamicOptions,
  validation,
  showWhen,
  hideWhen,
  enableWhen,
  disableWhen,
  clearFields,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { options: dynamicOpts, loading } = useDynamicOptions(dynamicOptions);

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

  const options = dynamicOptions ? dynamicOpts : staticOptions;
  const error = errors[name];
  const colSpan = `col-span-${cols}`;
  const validationRules = getValidationRules(validation);

  return (
    <div className={cn(colSpan, className)}>
      <label
        htmlFor={name}
        className={cn(
          "block text-sm font-medium text-gray-700 mb-1.5",
          labelClassName
        )}
      >
        {label}
      </label>{" "}
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
          error
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
      {error && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {error.message as string}
        </p>
      )}
    </div>
  );
};
