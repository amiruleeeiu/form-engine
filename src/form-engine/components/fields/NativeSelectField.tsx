import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { NativeSelectFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { getValidationRules } from "../../utils/fieldValidation.js";

export const NativeSelectField: React.FC<NativeSelectFieldConfig> = ({
  name,
  label,
  placeholder = "Select an option",
  cols = 1,
  className,
  labelClassName,
  inputClassName,
  errorClassName,
  options = [],
  validation,
  showWhen,
  hideWhen,
  enableWhen,
  disableWhen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const currentValue = watch(name);

  const validationRules = useMemo(
    () => getValidationRules(validation),
    [validation]
  );

  const { ref, ...rest } = register(name, validationRules);

  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === currentValue);
  }, [options, currentValue]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string | number) => {
    setValue(name, value, { shouldValidate: true });
    setIsOpen(false);
  };

  if (!isVisible) return null;

  const error = errors[name];

  return (
    <div
      className={cn(
        cols === 2 || cols === 12 ? "md:col-span-2" : "md:col-span-1",
        className
      )}
      ref={dropdownRef}
    >
      <label
        htmlFor={name}
        className={cn(
          "block text-sm font-medium text-gray-700 mb-1.5",
          labelClassName
        )}
      >
        {label}
        {validation?.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <input type="hidden" {...rest} ref={ref} />

      <div className="relative">
        <button
          type="button"
          onClick={() => isEnabled && setIsOpen(!isOpen)}
          disabled={!isEnabled}
          className={cn(
            "relative w-full flex items-center justify-between",
            "px-3 py-2.5 text-sm text-left bg-white border rounded-lg",
            "transition-all duration-200 focus:outline-none",
            !error && !isOpen && "border-gray-300 hover:border-gray-400",
            !error && isOpen && "border-blue-500 ring-2 ring-blue-100",
            error && "border-red-500 ring-2 ring-red-100",
            !isEnabled && "bg-gray-100 cursor-not-allowed opacity-60",
            inputClassName
          )}
        >
          <span
            className={cn(
              "block truncate",
              selectedOption ? "text-gray-900" : "text-gray-400"
            )}
          >
            {selectedOption?.label || placeholder}
          </span>

          <svg
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform duration-200",
              isOpen && "transform rotate-180 text-blue-500"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div
          className={cn(
            "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden",
            "transition-all duration-200 transform origin-top",
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          <div className="max-h-60 overflow-y-auto py-1">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = currentValue === option.value;

                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "relative flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer",
                      "transition-colors duration-100",
                      !isSelected && "text-gray-700 hover:bg-gray-50",
                      isSelected && "bg-blue-50 text-blue-700 font-medium"
                    )}
                  >
                    <span className="block truncate">{option.label}</span>
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {error.message as string}
        </p>
      )}
    </div>
  );
};
