import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { SelectFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { useDynamicOptions } from "../../utils/dynamicOptions.js";

export const CustomSelectField: React.FC<SelectFieldConfig> = ({
  name,
  label,
  placeholder = "Select an option",
  cols = 12,
  className,
  labelClassName,
  inputClassName,
  errorClassName,
  options: staticOptions = [],
  dynamicOptions,
  showWhen,
  hideWhen,
  enableWhen,
  disableWhen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { options: dynamicOpts, loading } = useDynamicOptions(dynamicOptions);
  const currentValue = watch(name);

  const { ref, ...rest } = register(name);

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

  const options = dynamicOptions ? dynamicOpts : staticOptions;

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === currentValue);
  }, [options, currentValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && optionsRef.current && highlightedIndex >= 0) {
      const highlightedElement = optionsRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (value: string | number) => {
    setValue(name, value, { shouldValidate: true });
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery("");
        break;
    }
  };

  if (!isVisible) return null;

  const error = errors[name];
  const colSpan = `col-span-${cols}`;

  return (
    <div className={cn(colSpan, className)} ref={dropdownRef}>
      <label
        htmlFor={name}
        className={cn(
          "block text-sm font-medium text-gray-700 mb-1.5",
          labelClassName
        )}
      >
        {label}
      </label>

      <input type="hidden" {...rest} ref={ref} />

      <div className="relative">
        <button
          type="button"
          onClick={() => isEnabled && !loading && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={!isEnabled || loading}
          className={cn(
            "relative w-full flex items-center justify-between gap-2",
            "px-4 py-2.5 text-sm text-left bg-white border rounded-lg",
            "transition-all duration-200 focus:outline-none",
            "shadow-sm hover:shadow-md",
            !error &&
              !isOpen &&
              "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
            !error &&
              isOpen &&
              "border-blue-500 ring-2 ring-blue-200 shadow-md",
            error && "border-red-500 ring-2 ring-red-200",
            !isEnabled &&
              "bg-gray-50 cursor-not-allowed opacity-60 hover:shadow-sm",
            loading && "cursor-wait",
            inputClassName
          )}
        >
          <span className="flex items-center gap-2 flex-1 min-w-0">
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-gray-500 truncate">Loading...</span>
              </>
            ) : (
              <>
                <span
                  className={cn(
                    "block truncate",
                    selectedOption
                      ? "text-gray-900 font-medium"
                      : "text-gray-400"
                  )}
                >
                  {selectedOption?.label || placeholder}
                </span>
              </>
            )}
          </span>

          <svg
            className={cn(
              "w-5 h-5 text-gray-400 transition-all duration-300 flex-shrink-0",
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

        {/* Dropdown Menu */}
        <div
          className={cn(
            "absolute z-50 w-full mt-2",
            "bg-white border border-gray-200 rounded-xl shadow-2xl",
            "transition-all duration-300 transform origin-top",
            "backdrop-blur-sm",
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}
        >
          {" "}
          {/* Search Input */}
          {options.length > 5 && (
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search options..."
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  onKeyDown={handleKeyDown}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
          {/* Options List */}
          <div
            ref={optionsRef}
            className="max-h-64 overflow-y-auto py-2 custom-scrollbar"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 my-1 text-center">
                <svg
                  className="mx-auto w-12 h-12 text-gray-300 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-gray-500 font-medium">
                  No options found
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = currentValue === option.value;
                const isHighlighted = highlightedIndex === index;

                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "relative flex items-center justify-between gap-3 px-4 py-2.5 mx-2 rounded-lg",
                      "cursor-pointer transition-all duration-150",
                      "group",
                      !isSelected &&
                        !isHighlighted &&
                        "text-gray-700 hover:bg-gray-100",
                      !isSelected &&
                        isHighlighted &&
                        "bg-gray-100 text-gray-900",
                      isSelected && "bg-blue-500 text-white shadow-md"
                    )}
                  >
                    <span className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className={cn(
                          "block truncate text-sm transition-all",
                          isSelected ? "font-semibold" : "font-medium"
                        )}
                      >
                        {option.label}
                      </span>
                    </span>

                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-white flex-shrink-0 animate-in zoom-in-50 duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
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
