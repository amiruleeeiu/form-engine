import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { User, X } from "../../assets/icons/index.js";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import type { ProfilePictureFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";

export const ProfilePictureField: React.FC<ProfilePictureFieldConfig> = (
  props
) => {
  const {
    name,
    label,
    className,
    labelClassName,
    inputClassName,
    errorClassName,
    accept = "image/*",
    maxSize,
    uploadConfig,
  } = props;

  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { control } = useFormContext();

  // Use custom hook for all common field logic
  const { validationRules, isVisible, isEnabled, error, colSpan } =
    useFieldConfig(props);

  if (!isVisible) return null;

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: FileList | string | null) => void
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Check file size if maxSize is specified
      if (maxSize && file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        setUploadError(`File size must be less than ${maxSizeMB}MB`);
        e.target.value = "";
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // If uploadConfig is provided, upload to API
      if (uploadConfig) {
        setUploading(true);
        setUploadError(null);

        try {
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

          // Set the transformed value (e.g., image URL from response)
          onChange(finalValue);
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : "Upload failed");
          setPreview(null);
          e.target.value = "";
        } finally {
          setUploading(false);
        }
      } else {
        // No upload config, just set the file
        onChange(files);
      }
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const clearImage = (onChange: (value: FileList | string | null) => void) => {
    setPreview(null);
    setUploadError(null);
    onChange(null);
    // Reset the input
    const input = document.getElementById(name) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

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
        rules={validationRules}
        render={({ field: { onChange, ...field } }) => (
          <div className="space-y-3">
            {preview ? (
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => clearImage(onChange)}
                  disabled={!isEnabled}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}

            <input
              {...field}
              id={name}
              type="file"
              accept={accept}
              disabled={!isEnabled || uploading}
              onChange={(e) => handleFileChange(e, onChange)}
              className={cn(
                "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50",
                inputClassName
              )}
            />
            {uploading && (
              <p className="text-xs text-blue-600 mt-1">Uploading...</p>
            )}
          </div>
        )}
      />
      {uploadError && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {uploadError}
        </p>
      )}
      {error && (
        <p className={cn("mt-1.5 text-xs text-red-600", errorClassName)}>
          {error.message as string}
        </p>
      )}
    </div>
  );
};
