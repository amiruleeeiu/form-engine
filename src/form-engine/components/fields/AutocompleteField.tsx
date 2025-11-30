import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";
import type { AutocompleteFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import {
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { useDynamicOptions } from "../../utils/dynamicOptions.js";

export const AutocompleteField: React.FC<AutocompleteFieldConfig> = ({
  name,
  label,
  placeholder,
  cols = 12,
  className,
  labelClassName,
  errorClassName,
  options: staticOptions = [],
  dynamicOptions,
  isMulti = false,
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
  const { options: dynamicOpts, loading } = useDynamicOptions(dynamicOptions);

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

  const options = dynamicOptions ? dynamicOpts : staticOptions;
  const error = errors[name];
  const colSpan = `col-span-${cols}`;

  return (
    <div className={cn(colSpan, className)}>
      <label
        htmlFor={name}
        className={cn("block text-sm font-medium text-gray-700 mb-1", labelClassName)}
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            inputId={name}
            options={options}
            isMulti={isMulti}
            isLoading={loading}
            isDisabled={!isEnabled || loading}
            placeholder={placeholder}
            className={error ? "react-select-error" : ""}
            classNamePrefix="react-select"
            onChange={(selected) => {
              if (isMulti) {
                field.onChange(selected);
              } else {
                field.onChange(selected);
              }
            }}
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: "42px",
                paddingLeft: "4px",
                paddingRight: "4px",
                borderColor: error
                  ? "#ef4444"
                  : state.isFocused
                  ? "#3b82f6"
                  : "#d1d5db",
                boxShadow: state.isFocused
                  ? error
                    ? "0 0 0 2px rgba(239, 68, 68, 0.1)"
                    : "0 0 0 2px rgba(59, 130, 246, 0.1)"
                  : "none",
                "&:hover": {
                  borderColor: error ? "#ef4444" : "#9ca3af",
                },
              }),
              valueContainer: (base) => ({
                ...base,
                padding: "2px 8px",
              }),
            }}
          />
        )}
      />{" "}
      {error && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>{error.message as string}</p>
      )}
    </div>
  );
};
