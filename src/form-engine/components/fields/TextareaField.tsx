import React from "react";
import { useFormContext } from "react-hook-form";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import type { TextareaFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";

export const TextareaField: React.FC<TextareaFieldConfig> = (props) => {
  const {
    name,
    label,
    placeholder,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    validation,
    rows = 4,
  } = props;

  const { register } = useFormContext();

  // Use custom hook for all common field logic
  const { validationRules, isVisible, isEnabled, error } =
    useFieldConfig(props);

  if (!isVisible) return null;

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
          "focus:ring-4 bg-white focus:ring-blue-100 focus:border-blue-500 focus:outline-none",
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
