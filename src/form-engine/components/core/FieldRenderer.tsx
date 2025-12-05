import React from "react";
import type { FieldConfig } from "../../types/index.js";
import {
  CheckboxField,
  CustomSelectField,
  DateField,
  FileField,
  NumberField,
  PhoneField,
  RadioField,
  TextField,
  TextareaField,
} from "../fields/index.js";

interface FieldRendererProps {
  field: FieldConfig;
  fieldGroup?: string; // Parent key for nested field structure
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  fieldGroup,
}) => {
  // If fieldGroup is provided, create nested field name
  const fieldName = fieldGroup ? `${fieldGroup}.${field.name}` : field.name;

  // Create modified field config with nested name
  const modifiedField = fieldGroup ? { ...field, name: fieldName } : field;
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
    case "radio":
      return <RadioField {...modifiedField} />;
    case "checkbox":
      return <CheckboxField {...modifiedField} />;
    case "phone":
      return <PhoneField {...modifiedField} />;
    default:
      return null;
  }
};
