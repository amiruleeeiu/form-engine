import React, { useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Controller, useFormContext } from "react-hook-form";
import { Calendar } from "../../assets/icons/index.js";
import { useClickOutside } from "../../hooks/useClickOutside.js";
import { useDropdownPosition } from "../../hooks/useDropdownPosition.js";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import type { DateFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import { FieldLabel } from "../core/FieldLabel.js";
import { MonthYearSelector } from "./MonthYearSelector.js";

export const DateField: React.FC<DateFieldConfig> = (props) => {
  const {
    name,
    label,
    placeholder,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    min,
    max,
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

  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dropdownPosition = useDropdownPosition({
    isOpen,
    triggerRef: inputRef,
    dropdownHeight: 400,
  });

  useClickOutside({
    ref: containerRef,
    handler: () => setIsOpen(false),
    enabled: isOpen,
  });

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
        render={({ field }) => (
          <div className="relative" ref={containerRef}>
            <div className="relative">
              <input
                ref={inputRef}
                id={name}
                type="text"
                readOnly
                placeholder={placeholder || "Pick a date"}
                disabled={!isEnabled}
                value={formatDateForDisplay(field.value)}
                onClick={() => isEnabled && setIsOpen(!isOpen)}
                className={cn(
                  "flex h-10 w-full items-center justify-between rounded-sm border bg-white px-3 py-2 text-sm shadow-sm outline-blue-500 transition-all",
                  "placeholder:text-blue-500",
                  "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
                  error
                    ? "border-red-500 text-red-900 "
                    : "border-slate-200 hover:border-slate-300 ",
                  !isEnabled && "bg-slate-50 hover:border-slate-200",
                  inputClassName
                )}
              />
              <Calendar
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors",
                  !isEnabled ? "text-slate-400" : "text-slate-500"
                )}
              />
            </div>

            {isOpen && isEnabled && (
              <div
                className={cn(
                  "absolute z-50 rounded-xl border border-slate-200 bg-white p-4 shadow-xl",
                  "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
                  dropdownPosition === "top"
                    ? "bottom-full mb-2"
                    : "top-full mt-2"
                )}
              >
                {/* Month and Year Selectors */}
                <MonthYearSelector
                  currentMonth={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="mb-3"
                />
                <DayPicker
                  mode="single"
                  selected={parseDate(field.value)}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(formatDateForValue(date));
                    }
                    setIsOpen(false);
                  }}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
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
      {shouldShowError && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {error?.message as string}
        </p>
      )}
    </div>
  );
};
