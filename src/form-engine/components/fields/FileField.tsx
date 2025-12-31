import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import { useUploadSources } from "../../hooks/useUploadSources.js";
import type { FileFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import { FieldLabel } from "../core/FieldLabel.js";

export const FileField: React.FC<FileFieldConfig> = (props) => {
  const {
    name,
    label,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    accept,
    multiple = false,
    uploadSourceId,
    validation,
  } = props;

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { control } = useFormContext();
  const { getUploadSource } = useUploadSources();

  // Use custom hook for all common field logic
  const {
    validationRules,
    isVisible,
    isEnabled,
    error,
    colSpan,
    shouldShowError,
  } = useFieldConfig(props);

  if (!isVisible) return null;

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: FileList | File | string | null) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      onChange(null);
      return;
    }

    // If uploadSourceId is provided, upload the file
    if (uploadSourceId) {
      const uploadConfig = getUploadSource(uploadSourceId);

      if (!uploadConfig) {
        console.error(`Upload source with id "${uploadSourceId}" not found`);
        onChange(multiple ? files : files[0]);
        return;
      }

      setUploading(true);
      setUploadError(null);

      try {
        if (multiple) {
          // Upload multiple files
          const uploadPromises = Array.from(files).map(async (file) => {
            const formData = new FormData();
            const fieldName = uploadConfig.fieldName || "file";
            formData.append(fieldName, file);

            // Add additional data if provided
            if (uploadConfig.additionalData) {
              Object.entries(uploadConfig.additionalData).forEach(
                ([key, value]) => {
                  formData.append(key, value);
                }
              );
            }

            const response = await fetch(uploadConfig.url, {
              method: uploadConfig.method || "POST",
              headers: uploadConfig.headers,
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();

            // Transform response if transformer is provided
            return uploadConfig.transform ? uploadConfig.transform(data) : data;
          });

          const results = await Promise.all(uploadPromises);
          onChange(results as any);
        } else {
          // Upload single file
          const file = files[0];
          const formData = new FormData();
          const fieldName = uploadConfig.fieldName || "file";
          formData.append(fieldName, file);

          // Add additional data if provided
          if (uploadConfig.additionalData) {
            Object.entries(uploadConfig.additionalData).forEach(
              ([key, value]) => {
                formData.append(key, value);
              }
            );
          }

          const response = await fetch(uploadConfig.url, {
            method: uploadConfig.method || "POST",
            headers: uploadConfig.headers,
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const data = await response.json();

          // Transform response if transformer is provided
          const finalValue = uploadConfig.transform
            ? uploadConfig.transform(data)
            : data;

          onChange(finalValue);
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
        e.target.value = "";
      } finally {
        setUploading(false);
      }
    } else {
      // No upload config, just set the file
      onChange(multiple ? files : files[0]);
    }
  };

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
        render={({ field: { onChange, value, ...field } }) => (
          <div>
            <input
              {...field}
              id={name}
              type="file"
              accept={accept}
              multiple={multiple}
              disabled={!isEnabled || uploading}
              onChange={(e) => handleFileChange(e, onChange)}
              value="" // File inputs can only have empty string as value
              className={cn(
                "w-full px-4 py-2.5 text-sm border rounded-md bg-white text-gray-900 transition-colors duration-200 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer",
                error || uploadError
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                inputClassName
              )}
            />
            {uploading && (
              <p className="mt-1.5 text-xs text-blue-600">Uploading...</p>
            )}
            {/* Show uploaded file URL/name if available */}
            {value && typeof value === "string" && (
              <p className="mt-1.5 text-xs text-green-600">
                ✓ Uploaded: {value.split("/").pop() || value}
              </p>
            )}
          </div>
        )}
      />
      {uploadError && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {uploadError}
        </p>
      )}
      {shouldShowError && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {error?.message as string}
        </p>
      )}
    </div>
  );
};
