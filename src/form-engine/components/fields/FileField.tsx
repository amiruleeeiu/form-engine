import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import type { FileFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";

export const FileField: React.FC<FileFieldConfig> = (props) => {
  const {
    name,
    label,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    accept,
    multiple = false,
  } = props;

  const { control } = useFormContext();

  // Use custom hook for all common field logic
  const { validationRules, isVisible, isEnabled, error, colSpan } =
    useFieldConfig(props);

  if (!isVisible) return null;
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
        render={({ field: { onChange, ...field } }) => (
          <input
            {...field}
            id={name}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={!isEnabled}
            onChange={(e) => {
              const files = e.target.files;
              onChange(multiple ? files : files?.[0]);
            }}
            className={cn(
              "w-full px-4 py-2.5 text-sm border rounded-md bg-white text-gray-900 transition-colors duration-200 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer",
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
