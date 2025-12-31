import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Check, ChevronDown, Spinner, X } from "../../assets/icons/index.js";
import { useClickOutside } from "../../hooks/useClickOutside.js";
import { useDropdownPosition } from "../../hooks/useDropdownPosition.js";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import type { SelectFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import { useDynamicOptions } from "../../utils/dynamicOptions.js";
import { FieldLabel } from "../core/FieldLabel.js";

export const CustomSelectField: React.FC<SelectFieldConfig> = (props) => {
  const {
    name,
    label,
    placeholder = "Select an option",
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    options: staticOptions = [],
    dynamicOptions,
    isMulti = false,
    validation,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { register, watch, setValue } = useFormContext();

  const { options: dynamicOpts, loading } = useDynamicOptions(dynamicOptions);
  const currentValue = watch(name);

  const dropdownPosition = useDropdownPosition({
    isOpen,
    triggerRef: buttonRef,
    dropdownHeight: 300,
  });

  // Use custom hook for all common field logic
  const {
    validationRules,
    isVisible,
    isEnabled,
    error,
    colSpan,
    shouldShowError,
  } = useFieldConfig(props);

  const { ref, ...rest } = register(name, validationRules);

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

  useClickOutside({
    ref: dropdownRef,
    handler: () => {
      setIsOpen(false);
      setSearchQuery("");
    },
    enabled: true,
  });

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

  if (!isVisible) return null;

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

  return (
    <div className={cn(colSpan, className)} ref={dropdownRef}>
      <FieldLabel
        htmlFor={name}
        label={label}
        required={!!validation?.required}
        className={labelClassName}
      />

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
            "px-2.5 py-[.55rem] text-sm text-left bg-white border rounded-md text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none",
            shouldShowError
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500",
            !isEnabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
            loading && "cursor-wait",
            isMulti && selectedOptions.length > 0 && "py-2",
            inputClassName
          )}
        >
          <span className="flex items-center gap-2 flex-1 min-w-0">
            {loading ? (
              <>
                <Spinner className="animate-spin h-4 w-4 text-gray-400" />
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
                      <X className="w-3.5 h-3.5" />
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
                <X className="w-4 h-4 text-gray-400 hover:text-gray-500" />
              </button>
            ) : (
              /* Dropdown Arrow - show when no value is selected */
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400 transition-transform",
                  isOpen && "transform rotate-180"
                )}
              />
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
                        isSelected && !isMulti && "bg-blue-50 text-blue-500",
                        isHighlighted && "bg-gray-100",
                        !isSelected && !isHighlighted && "text-gray-700"
                      )}
                    >
                      {isMulti && (
                        <div
                          className={cn(
                            "flex items-center justify-center w-4 h-4 border rounded shrink-0",
                            isSelected
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300"
                          )}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      )}
                      <span className="truncate flex-1">{option.label}</span>
                      {isSelected && !isMulti && (
                        <Check className="w-4 h-4 shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {shouldShowError && (
        <p
          className={cn(
            "mt-1.5 text-xs text-red-500 flex items-center gap-1",
            errorClassName
          )}
        >
          {error?.message as string}
        </p>
      )}
    </div>
  );
};
