/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { CheckboxFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { getValidationRules } from "../../utils/fieldValidation.js";

export const CheckboxField: React.FC<CheckboxFieldConfig> = ({
  name,
  label,
  checkboxLabel,
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
}) => {
  const {
    register,
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
    const map: Record<string, any> = {};
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

  if (!isVisible) return null;

  const error = errors[name];
  const colSpan = `col-span-${cols}`;
  return (
    <div className={cn(colSpan, className)}>
      <label
        className={cn(
          "block text-sm font-semibold text-gray-800 mb-3",
          labelClassName
        )}
      >
        {label}
      </label>
      <label className="flex items-center space-x-3 cursor-pointer py-4 transition-all duration-200">
        <input
          type="checkbox"
          disabled={!isEnabled}
          {...register(name, getValidationRules(validation))}
          className={cn(
            "w-5 h-5 text-blue-600 border-2 disabled:cursor-not-allowed",
            inputClassName
          )}
        />
        <span className="text-sm font-medium text-gray-800">
          {checkboxLabel || label}
        </span>
      </label>
      {error && (
        <p
          className={cn(
            "mt-2 text-sm font-medium text-red-600 flex items-center",
            errorClassName
          )}
        >
          <span className="mr-1">⚠</span>
          {error.message as string}
        </p>
      )}
    </div>
  );
};
