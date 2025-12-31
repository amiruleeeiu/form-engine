import React, { useContext } from "react";
import type { FieldConfig } from "../../types/index.js";
import {
  CheckboxField,
  CustomSelectField,
  DateField,
  DropzoneField,
  FileField,
  NumberField,
  PasswordField,
  PhoneField,
  ProfilePictureField,
  RadioField,
  TextField,
  TextareaField,
} from "../fields/index.js";
import { DataSourceContext } from "./FormContexts.js";

interface FieldRendererProps {
  field: FieldConfig;
  fieldGroup?: string; // Parent key for nested field structure
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  fieldGroup,
}) => {
  const dataSourceState = useContext(DataSourceContext);

  // If fieldGroup is provided, create nested field name
  const fieldName = fieldGroup ? `${fieldGroup}.${field.name}` : field.name;

  // Create modified field config with nested name
  const modifiedField = fieldGroup ? { ...field, name: fieldName } : field;

  // If field is read-only with data source, render read-only display
  if (modifiedField.readOnly && modifiedField.dataSourceId && dataSourceState) {
    const value = dataSourceState.getValue(
      modifiedField.dataSourceId,
      modifiedField.dataPath
    );
    const isLoading = dataSourceState.loading[modifiedField.dataSourceId];
    const error = dataSourceState.errors[modifiedField.dataSourceId];

    return (
      <div className={modifiedField.className}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {modifiedField.label}
        </label>
        <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
          {isLoading ? (
            <span className="text-gray-400 italic">Loading...</span>
          ) : error ? (
            <span className="text-red-500 text-sm">Error: {error}</span>
          ) : value !== undefined && value !== null ? (
            <span>{String(value)}</span>
          ) : (
            <span className="text-gray-400 italic">N/A</span>
          )}
        </div>
      </div>
    );
  }

  switch (modifiedField.type) {
    case "text":
      return <TextField {...modifiedField} />;
    case "textarea":
      return <TextareaField {...modifiedField} />;
    case "number":
      return <NumberField {...modifiedField} />;
    case "date":
      return <DateField {...modifiedField} />;
    case "select":
      return <CustomSelectField {...modifiedField} />;
    case "file":
      return <FileField {...modifiedField} />;
    case "dropzone":
      return <DropzoneField {...modifiedField} />;
    case "radio":
      return <RadioField {...modifiedField} />;
    case "checkbox":
      return <CheckboxField {...modifiedField} />;
    case "phone":
      return <PhoneField {...modifiedField} />;
    case "password":
      return <PasswordField {...modifiedField} />;
    case "profilePicture":
      return <ProfilePictureField {...modifiedField} />;
    default:
      return null;
  }
};
