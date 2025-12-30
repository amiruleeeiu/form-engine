import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye } from "../../assets/icons/Eye.js";
import { EyeOff } from "../../assets/icons/EyeOff.js";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import type { PasswordFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";

export const PasswordField: React.FC<PasswordFieldConfig> = (props) => {
  const {
    name,
    label,
    placeholder,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    showToggle = true,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

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
      <div className="relative">
        <input
          {...register(name, validationRules)}
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={!isEnabled}
          className={cn(
            "w-full px-4 py-[.55rem] text-sm border rounded-md bg-white text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none",
            shouldShowError
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
            !isEnabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
            showToggle ? "pr-10" : "",
            inputClassName
          )}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            disabled={!isEnabled}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>
      {shouldShowError && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {error.message as string}
        </p>
      )}
    </div>
  );
};
