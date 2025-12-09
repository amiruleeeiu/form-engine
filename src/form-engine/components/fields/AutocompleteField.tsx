import React, { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { AutocompleteFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { useDynamicOptions } from "../../utils/dynamicOptions.js";
import { getValidationRules } from "../../utils/fieldValidation.js";

export const AutocompleteField: React.FC<AutocompleteFieldConfig> = ({
  name,
  label,
  placeholder = "Select an option",
  cols = 12,
  className,
  labelClassName,
  inputClassName,
  errorClassName,
  validation,
  options: staticOptions = [],
  dynamicOptions,
  showWhen,
  hideWhen,
  enableWhen,
  disableWhen,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    control,
    watch,
    formState: { errors, touchedFields, isSubmitted },
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
  const isTouched = touchedFields[name];
  const showError = error && (isTouched || isSubmitted);
  const colSpan = `col-span-${cols}`;

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      </label>
      <Controller
        name={name}
        control={control}
        rules={getValidationRules(validation)}
        render={({ field }) => (
          <>
            <input
              {...field}
              id={name}
              type="text"
              list={`${name}-options`}
              placeholder={placeholder}
              disabled={!isEnabled || loading}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                field.onChange(e.target.value);
              }}
              className={cn(
                "w-full px-4 py-2.5 text-sm border rounded-md bg-white text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none",
                showError
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                !isEnabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
                inputClassName
              )}
            />
            <datalist id={`${name}-options`}>
              {filteredOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </datalist>
          </>
        )}
      />
      {showError && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {error.message as string}
        </p>
      )}
    </div>
  );
};
