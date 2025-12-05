import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { NumberFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
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
  className,
  labelClassName,
  inputClassName,
  errorClassName,
  validation,
  maxLength,
  showWhen,
  hideWhen,
  enableWhen,
  disableWhen,
}) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only allow digits (0-9)
    const key = e.key;
    if (
      !/^\d$/.test(key) &&
      key !== "Backspace" &&
      key !== "Delete" &&
      key !== "ArrowLeft" &&
      key !== "ArrowRight" &&
      key !== "Tab"
    ) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Get pasted text
    const pastedText = e.clipboardData.getData("text");
    // Only allow if all characters are digits
    if (!/^\d*$/.test(pastedText)) {
      e.preventDefault();
    }
  };

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
          <input
            {...field}
            id={name}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            placeholder={placeholder}
            disabled={!isEnabled}
            maxLength={maxLength}
            onKeyDown={handleKeyPress}
            onPaste={handlePaste}
            onChange={(e) => {
              // Filter out non-digit characters
              const value = e.target.value.replace(/\D/g, "");
              field.onChange(value);
            }}
            className={cn(
              "w-full px-4 py-2.5 text-sm border rounded-md bg-white text-gray-900 transition-colors duration-200 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
              inputClassName
            )}
          />
        )}
      />
      {error && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {error.message as string}
        </p>
      )}
    </div>
  );
};
