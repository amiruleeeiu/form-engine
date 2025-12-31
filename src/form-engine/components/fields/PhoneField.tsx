import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { AlertCircle } from "../../assets/icons/AlertCircle.js";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import type { PhoneFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import { FieldLabel } from "../core/FieldLabel.js";

export const PhoneField: React.FC<PhoneFieldConfig> = (props) => {
  const {
    name,
    label,
    placeholder = "Enter phone number",
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    defaultCountry = "bd",
    validation,
  } = props;

  const { control } = useFormContext();

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
      <FieldLabel
        htmlFor={name}
        label={label}
        required={!!validation?.required}
        className={labelClassName}
      />

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field: { onChange, value } }) => (
          <PhoneInput
            country={defaultCountry}
            value={value}
            onChange={onChange}
            disabled={!isEnabled}
            placeholder={placeholder}
            disableCountryCode={false}
            countryCodeEditable={false}
            containerClass={cn(
              "phone-input-wrapper",
              shouldShowError && "phone-input-error",
              !isEnabled && "phone-input-disabled"
            )}
            inputClass={cn("phone-input-field", inputClassName)}
            inputStyle={{
              width: "100%",
              height: "40px",
              paddingTop: "10px",
              paddingBottom: "10px",
              border: shouldShowError
                ? "1.5px solid #ef4444"
                : "1px solid #d1d5db",
              borderRadius: "0.375rem",
              outline: "none",
            }}
            buttonClass="phone-input-button"
            buttonStyle={{
              border: shouldShowError
                ? "1.5px solid #ef4444"
                : "1px solid #d1d5db",
              borderRight: "none",
              borderRadius: "0.375rem 0 0 0.375rem",
              outline: "none",
            }}
            dropdownClass="phone-input-dropdown"
            enableSearch
            searchPlaceholder="Search countries"
          />
        )}
      />

      {shouldShowError && (
        <p
          className={cn(
            "mt-1.5 text-xs text-red-600 flex items-center gap-1",
            errorClassName
          )}
        >
          <AlertCircle />
          {error.message as string}
        </p>
      )}
    </div>
  );
};
