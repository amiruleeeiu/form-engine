import React, { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Controller, useFormContext } from "react-hook-form";
import { Calendar } from "../../assets/icons/index.js";
import type { DateFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { getValidationRules } from "../../utils/fieldValidation.js";

export const DateField: React.FC<DateFieldConfig> = ({
  name,
  label,
  placeholder,
  cols = 12,
  className,
  labelClassName,
  inputClassName,
  errorClassName,
  validation,
  min,
  max,
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

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const formatDateForDisplay = (date: string | Date | undefined): string => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateForValue = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  if (!isVisible) return null;

  const error = errors[name];
  const colSpan = `col-span-${cols}`;

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
          <div className="relative" ref={containerRef}>
            <div className="relative">
              <input
                id={name}
                type="text"
                readOnly
                placeholder={placeholder}
                disabled={!isEnabled}
                value={formatDateForDisplay(field.value)}
                onClick={() => isEnabled && setIsOpen(!isOpen)}
                className={cn(
                  "w-full px-4 py-2.5 pr-10 text-sm border rounded-md bg-white text-gray-900 transition-colors duration-200 focus:outline-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                  inputClassName
                )}
              />
              <Calendar
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
                  !isEnabled ? "text-gray-400" : "text-gray-500"
                )}
              />
            </div>

            {isOpen && isEnabled && (
              <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                <DayPicker
                  mode="single"
                  selected={parseDate(field.value)}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(formatDateForValue(date));
                      setIsOpen(false);
                    }
                  }}
                  disabled={[
                    ...(min ? [{ before: new Date(min) }] : []),
                    ...(max ? [{ after: new Date(max) }] : []),
                  ]}
                  className="rdp-custom"
                />
              </div>
            )}
          </div>
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
