import React from "react";
import { useFormContext } from "react-hook-form";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import type { TextFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import { FieldLabel } from "../core/FieldLabel.js";

export const TextField: React.FC<TextFieldConfig> = (props) => {
  const {
    name,
    label,
    placeholder,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    validation,
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

  console.log(error);

  // Debug log
  if (error) {
    console.log(
      `[TextField ${name}] shouldShowError:`,
      shouldShowError,
      "error:",
      error.message
    );
  }

  if (!isVisible) return null;

  return (
    <div className={cn(colSpan, className)}>
      <FieldLabel
        htmlFor={name}
        label={label}
        required={!!validation?.required}
        className={labelClassName}
      />
      <input
        id={name}
        type="text"
        placeholder={placeholder}
        disabled={!isEnabled}
        {...register(name, validationRules)}
        className={cn(
          "w-full px-3 py-[.55rem] text-sm border rounded-md bg-white text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none",
          shouldShowError
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500",
          !isEnabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
          inputClassName
        )}
      />
      {shouldShowError && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {error?.message as string}
        </p>
      )}
    </div>
  );
};
