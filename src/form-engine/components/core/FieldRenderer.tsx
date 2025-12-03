import React from "react";
import type { FieldConfig } from "../../types/index.js";
import {
  AutocompleteField,
  CheckboxField,
  CustomSelectField,
  DateField,
  FileField,
  NumberField,
  RadioField,
  TextField,
  TextareaField,
} from "../fields/index.js";

interface FieldRendererProps {
  field: FieldConfig;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field }) => {
  switch (field.type) {
    case "text":
      return <TextField {...field} />;
    case "textarea":
      return <TextareaField {...field} />;
    case "number":
      return <NumberField {...field} />;
    case "date":
      return <DateField {...field} />;
    case "select":
      return <CustomSelectField {...field} />;
    case "autocomplete":
      return <AutocompleteField {...field} />;
    case "file":
      return <FileField {...field} />;
    case "radio":
      return <RadioField {...field} />;
    case "checkbox":
      return <CheckboxField {...field} />;
    default:
      return null;
  }
};
