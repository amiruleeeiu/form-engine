import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { RadioFieldConfig } from "../../types/index.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../../utils/conditionalLogic.js";

export const RadioField: React.FC<RadioFieldConfig> = ({
  name,
  label,
  cols = 12,
  className = "",
  options,
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

  if (!isVisible) return null;

  const error = errors[name];
  const colSpan = `col-span-${cols}`;
  return (
    <div className={`${colSpan} ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2.5 cursor-pointer p-1 transition-colors duration-200"
          >
            <input
              type="radio"
              value={option.value}
              disabled={!isEnabled}
              {...register(name)}
              className="w-4 h-4 text-blue-600 border-gray-300 disabled:cursor-not-allowed"
            />
            <span className="text-sm text-gray-900">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error.message as string}</p>
      )}
    </div>
  );
};
