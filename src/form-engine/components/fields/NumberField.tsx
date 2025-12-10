import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import type { NumberFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";

export const NumberField: React.FC<NumberFieldConfig> = (props) => {
  const {
    name,
    label,
    placeholder,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    maxLength,
  } = props;

  const { control } = useFormContext();

  // Use custom hook for all common field logic
  const { validationRules, isVisible, isEnabled, error, colSpan } =
    useFieldConfig(props);

  if (!isVisible) return null;

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
        rules={validationRules}
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
