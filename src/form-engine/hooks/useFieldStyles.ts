import { useMemo } from "react";
import { cn } from "../utils/cn.js";

interface FieldStylesConfig {
  cols?: number;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

/**
 * Custom hook to handle field styling and CSS class management
 * Provides consistent styling utilities across all field components
 */
export const useFieldStyles = (config: FieldStylesConfig) => {
  const {
    cols = 12,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
  } = config;

  const colSpan = `col-span-${cols}`;

  const wrapperClassName = useMemo(
    () => cn(colSpan, className),
    [colSpan, className]
  );

  const labelClasses = useMemo(
    () => cn("block text-sm font-medium text-gray-700 mb-1.5", labelClassName),
    [labelClassName]
  );

  const inputClasses = useMemo(
    () =>
      cn(
        "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed",
        inputClassName
      ),
    [inputClassName]
  );

  const errorClasses = useMemo(
    () => cn("text-sm text-red-600 mt-1", errorClassName),
    [errorClassName]
  );

  return {
    colSpan,
    wrapperClassName,
    labelClasses,
    inputClasses,
    errorClasses,
  };
};
