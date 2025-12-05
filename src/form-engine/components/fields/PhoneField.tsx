import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import type { PhoneFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { getValidationRules } from "../../utils/fieldValidation.js";

export const PhoneField: React.FC<PhoneFieldConfig> = ({
  name,
  label,
  placeholder = "Enter phone number",
  cols = 12,
  className,
  labelClassName,
  inputClassName,
  errorClassName,
  validation,
  showWhen,
  hideWhen,
  enableWhen,
  disableWhen,
  defaultCountry = "bd",
}) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  // Get all fields that need to be watched for conditional logic
  const watchFields = useMemo(() => {
    const fields = new Set<string>();
    [showWhen, hideWhen, enableWhen, disableWhen].forEach((condition) => {
      getWatchedFields(condition).forEach((field) => fields.add(field));
    });
    return Array.from(fields);
  }, [showWhen, hideWhen, enableWhen, disableWhen]);

  // Watch the dependent fields
  const watchedValues = watch(watchFields);

  // Create a map of field names to their values
  const valueMap = useMemo(() => {
    const map: Record<string, unknown> = {};
    watchFields.forEach((field, index) => {
      map[field] = watchedValues[index];
    });
    return map;
  }, [watchFields, watchedValues]);

  // Check visibility
  const isVisible = useMemo(() => {
    const showField = showWhen?.field ? valueMap[showWhen.field] : undefined;
    const hideField = hideWhen?.field ? valueMap[hideWhen.field] : undefined;
    return shouldShowField(
      showWhen,
      hideWhen,
      showWhen ? showField : hideField
    );
  }, [showWhen, hideWhen, valueMap]);

  // Check if field should be enabled
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
  const rules = getValidationRules(validation);

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
        rules={rules}
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
              error && "phone-input-error",
              !isEnabled && "phone-input-disabled"
            )}
            inputClass={cn("phone-input-field", inputClassName)}
            inputStyle={{
              width: "100%",
              height: "42px",
              paddingTop: "10px",
              paddingBottom: "10px",
              border: error ? "1.5px solid #ef4444" : "1px solid #d1d5db",
              borderRadius: "0.375rem",
              outline: "none",
            }}
            buttonClass="phone-input-button"
            buttonStyle={{
              border: error ? "1.5px solid #ef4444" : "1px solid #d1d5db",
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

      {error && (
        <p
          className={cn(
            "mt-1.5 text-xs text-red-600 flex items-center gap-1",
            errorClassName
          )}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error.message as string}
        </p>
      )}
    </div>
  );
};
