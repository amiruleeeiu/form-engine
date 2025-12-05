import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useFormContext } from "react-hook-form";
import type { SelectFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { useDynamicOptions } from "../../utils/dynamicOptions.js";
import { getValidationRules } from "../../utils/fieldValidation.js";

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
  validation,
  isMulti = false,
  showWhen,
  hideWhen,
  enableWhen,
  disableWhen,
  clearFields,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { options: dynamicOpts, loading } = useDynamicOptions(dynamicOptions);
  const currentValue = watch(name);
  
  const validationRules = getValidationRules(validation);
  const { ref, ...rest } = register(name, validationRules);

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
    if (isMulti) return null;
    return options.find((opt) => opt.value === currentValue);
  }, [options, currentValue, isMulti]);

  const selectedOptions = useMemo(() => {
    if (!isMulti) return [];
    const values = Array.isArray(currentValue) ? currentValue : [];
    return options.filter((opt) => values.includes(opt.value));
  }, [options, currentValue, isMulti]);

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

  // Calculate dropdown position based on available space
  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 300; // Approximate max height of dropdown
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // Show dropdown above if not enough space below and more space above
      const newPosition =
        spaceBelow < dropdownHeight && spaceAbove > spaceBelow
          ? "top"
          : "bottom";
      flushSync(() => {
        setDropdownPosition(newPosition);
      });
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
    if (isMulti) {
      const currentValues = Array.isArray(currentValue) ? currentValue : [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      setValue(name, newValues, { shouldValidate: true });
    } else {
      setValue(name, value, { shouldValidate: true });
      setIsOpen(false);
      setSearchQuery("");
      setHighlightedIndex(0);

      // Clear dependent fields when value changes
      if (clearFields && clearFields.length > 0) {
        if (!value || value === "" || value === null || value === undefined) {
          console.log(`Clearing dependent fields for ${name}:`, clearFields);
          clearFields.forEach((fieldName) => {
            setValue(fieldName, "", {
              shouldValidate: false,
              shouldDirty: true,
            });
          });
        }
      }
    }
  };

  const handleRemoveOption = (
    e: React.MouseEvent,
    valueToRemove: string | number
  ) => {
    e.stopPropagation();
    const currentValues = Array.isArray(currentValue) ? currentValue : [];
    const newValues = currentValues.filter((v) => v !== valueToRemove);
    setValue(name, newValues, { shouldValidate: true });
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name, isMulti ? [] : null, { shouldValidate: true });

    // Clear dependent fields when this field is cleared
    if (clearFields && clearFields.length > 0) {
      console.log(`Clearing dependent fields for ${name}:`, clearFields);
      clearFields.forEach((fieldName) => {
        setValue(fieldName, "", { shouldValidate: false, shouldDirty: true });
      });
    }
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
          ref={buttonRef}
          type="button"
          onClick={() => isEnabled && !loading && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={!isEnabled || loading}
          className={cn(
            "relative w-full flex items-center justify-between gap-2",
            "px-4 py-2.5 text-sm text-left bg-white border rounded-md text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
            !isEnabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
            loading && "cursor-wait",
            isMulti && selectedOptions.length > 0 && "py-2",
            inputClassName
          )}
        >
          <span className="flex items-center gap-2 flex-1 min-w-0">
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-gray-400"
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
            ) : isMulti && selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1 flex-1">
                {selectedOptions.map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md"
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveOption(e, option.value)}
                      className="flex items-center justify-center rounded hover:bg-blue-200 transition-colors focus:outline-none p-0.5"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span
                className={cn(
                  "block truncate",
                  selectedOption ? "text-gray-900" : "text-gray-400"
                )}
              >
                {selectedOption?.label || placeholder}
              </span>
            )}
          </span>

          <div className="flex items-center gap-1 shrink-0">
            {!isMulti && selectedOption && isEnabled && !loading ? (
              /* Clear Icon - show when value is selected */
              <button
                type="button"
                onClick={handleClearSelection}
                className="flex items-center justify-center rounded hover:bg-gray-100 transition-colors focus:outline-none"
                title="Clear selection"
              >
                <svg
                  className="w-4 h-4 text-gray-400 hover:text-gray-600"
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
            ) : (
              /* Dropdown Arrow - show when no value is selected */
              <svg
                className={cn(
                  "w-4 h-4 text-gray-400 transition-transform",
                  isOpen && "transform rotate-180"
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
            )}
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={cn(
              "absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg",
              dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"
            )}
          >
            {/* Search Input */}
            {options.length > 5 && (
              <div className="p-2 border-b border-gray-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}

            {/* Options List */}
            <div ref={optionsRef} className="max-h-60 overflow-y-auto py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-gray-500">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = isMulti
                    ? Array.isArray(currentValue) &&
                      currentValue.includes(option.value)
                    : currentValue === option.value;
                  const isHighlighted = highlightedIndex === index;

                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer",
                        isSelected && !isMulti && "bg-blue-50 text-blue-600",
                        isHighlighted && "bg-gray-100",
                        !isSelected && !isHighlighted && "text-gray-700"
                      )}
                    >
                      {isMulti && (
                        <div
                          className={cn(
                            "flex items-center justify-center w-4 h-4 border rounded shrink-0",
                            isSelected
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300"
                          )}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
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
                      )}
                      <span className="truncate flex-1">{option.label}</span>
                      {isSelected && !isMulti && (
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
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
        )}
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
