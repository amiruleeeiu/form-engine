import React, { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { X } from "../../assets/icons/index.js";
import { useFieldConfig } from "../../hooks/useFieldConfig.js";
import { useUploadSources } from "../../hooks/useUploadSources.js";
import type { DropzoneFieldConfig } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import { FieldLabel } from "../core/FieldLabel.js";

export const DropzoneField: React.FC<DropzoneFieldConfig> = (props) => {
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
    maxSize,
    maxFiles,
    validation,
  } = props;

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (maxSize && file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      return `File size must be less than ${maxSizeMB}MB`;
    }

    // Check file type
    if (accept) {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const fileMimeType = file.type;

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileExtension === type.toLowerCase();
        }
        if (type.endsWith("/*")) {
          const mainType = type.split("/")[0];
          return fileMimeType.startsWith(mainType);
        }
        return fileMimeType === type;
      });

      if (!isAccepted) {
        return `File type not accepted. Allowed: ${accept}`;
      }
    }

    return null;
  };

  const handleFileUpload = async (
    files: FileList,
    onChange: (value: FileList | File | string | string[] | null) => void
  ) => {
    const fileArray = Array.from(files);

    // Check max files
    if (maxFiles && fileArray.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate all files
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }
    }

    // If uploadSourceId is provided, upload the files
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
          const uploadPromises = fileArray.map(async (file) => {
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
          setUploadedFiles((prev) => [...prev, ...results]);
          onChange(results);
        } else {
          // Upload single file
          const file = fileArray[0];
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

          setUploadedFiles([finalValue]);
          onChange(finalValue);
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    } else {
      // No upload config, just set the files
      onChange(multiple ? files : files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEnabled || uploading) return;
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    onChange: (value: FileList | File | string | string[] | null) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (!isEnabled || uploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files, onChange);
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: FileList | File | string | string[] | null) => void
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files, onChange);
    }
  };

  const removeFile = (
    index: number,
    onChange: (value: string | string[] | null) => void
  ) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onChange(multiple ? newFiles : null);
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
        render={({ field: { onChange } }) => (
          <div className="space-y-3">
            {/* Dropzone Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, onChange)}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={cn(
                "relative border-2 border-dashed rounded-lg p-10 transition-all duration-200 cursor-pointer",
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : error || uploadError
                  ? "border-red-300 bg-red-50 hover:border-red-400"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100",
                !isEnabled || uploading
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer",
                inputClassName
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={!isEnabled || uploading}
                onChange={(e) => handleFileInputChange(e, onChange)}
                className="hidden"
                value=""
              />

              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <svg
                  className={cn(
                    "w-8 h-8",
                    isDragActive ? "text-blue-500" : "text-gray-400"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>

                <div className="text-sm text-gray-600">
                  {uploading ? (
                    <p className="font-medium text-blue-600">Uploading...</p>
                  ) : isDragActive ? (
                    <p className="font-medium text-blue-600">
                      Drop files here...
                    </p>
                  ) : (
                    <>
                      <p className="font-medium">
                        <span className="text-blue-600 hover:text-blue-700">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      {accept && (
                        <p className="text-xs text-gray-500 mt-1">
                          Accepted: {accept}
                        </p>
                      )}
                      {maxSize && (
                        <p className="text-xs text-gray-500">
                          Max size: {formatFileSize(maxSize)}
                        </p>
                      )}
                      {maxFiles && multiple && (
                        <p className="text-xs text-gray-500">
                          Max files: {maxFiles}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((fileUrl, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <svg
                        className="w-5 h-5 text-green-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 truncate">
                        {fileUrl.split("/").pop() || fileUrl}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index, onChange)}
                      className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
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
