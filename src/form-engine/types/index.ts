/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

// Condition types for conditional logic
export type ConditionOperator =
  | "equals"
  | "notEquals"
  | "in"
  | "notIn"
  | "isEmpty"
  | "isNotEmpty"
  | "greaterThan"
  | "lessThan";

export interface Condition {
  field: string;
  operator?: ConditionOperator;
  // Shorthand properties
  equals?: any;
  notEquals?: any;
  in?: any[];
  notIn?: any[];
  isEmpty?: boolean;
  isNotEmpty?: boolean;
  greaterThan?: number;
  lessThan?: number;
}

// Select option types
export interface SelectOption {
  label: string;
  value: any;
}

export interface DynamicSelectConfig {
  url?: string;
  fetchFunction?: () => Promise<SelectOption[]>;
  transform?: (data: any) => SelectOption[];
}

// API Data Source configuration for read-only fields
export interface DataSource {
  id: string; // Unique identifier for this data source
  url: string; // API endpoint
  method?: "GET" | "POST"; // HTTP method (default: GET)
  headers?: Record<string, string>; // Custom headers
  params?: Record<string, any>; // Query params or request body
  transform?: (data: any) => Record<string, any>; // Transform response data
}

// File Upload Source configuration for centralized upload API
export interface FileUploadSource {
  id: string; // Unique identifier for this upload source
  url: string; // API endpoint for file upload
  method?: string; // HTTP method (default: "POST")
  headers?: Record<string, string>; // Custom headers
  fieldName?: string; // Form data field name (default: "file")
  additionalData?: Record<string, any>; // Additional form data to send
  onUploadProgress?: (progress: number) => void; // Upload progress callback
  transform?: (response: any) => any; // Transform the response to get the final value
}

export interface FileUploadConfig {
  url: string; // API endpoint for file upload
  method?: string; // HTTP method (default: "POST")
  headers?: Record<string, string>; // Custom headers
  fieldName?: string; // Form data field name (default: "file")
  additionalData?: Record<string, any>; // Additional form data to send
  onUploadProgress?: (progress: number) => void; // Upload progress callback
  transform?: (response: any) => any; // Transform the response to get the final value
}

// Field types
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "file"
  | "dropzone"
  | "radio"
  | "checkbox"
  | "phone"
  | "password"
  | "profilePicture";

// Field-level validation configuration
export interface FieldValidation {
  required?: boolean | string; // true, false, or custom error message
  minLength?: number | { value: number; message?: string };
  maxLength?: number | { value: number; message?: string };
  min?: number | { value: number; message?: string };
  max?: number | { value: number; message?: string };
  pattern?: { value: RegExp; message?: string };
  email?: boolean | string; // true or custom error message
  custom?: (value: any) => boolean | string; // Custom validation function
  validate?: any; // For custom validation functions
}

// Base field configuration
export interface BaseFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  helpText?: string; // Help text displayed below the field
  cols?: number; // Column span: 1 (half row), 2 or 12 (full row). Default: 1. Mobile is always full width.
  className?: string; // Custom class for the field container
  labelClassName?: string; // Custom class for the label
  inputClassName?: string; // Custom class for the input element
  errorClassName?: string; // Custom class for the error message
  defaultValue?: any;
  disabled?: boolean; // Disable the field

  // Read-only field with API data
  readOnly?: boolean; // Make field read-only
  dataSourceId?: string; // Reference to DataSource id
  dataPath?: string; // Path to extract value from data source (e.g., "user.name")

  // Field-level validation (optional, can be used with or without Zod schema)
  validation?: FieldValidation;

  // Conditional logic
  showWhen?: Condition;
  hideWhen?: Condition;
  enableWhen?: Condition;
  disableWhen?: Condition;

  // Clear dependent fields when this field is cleared/changed
  clearFields?: string[];
}

// Specific field configurations
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text";
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  rows?: number;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  minLength?: number;
  maxLength?: number;
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  min?: string;
  max?: string;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options?: SelectOption[];
  dynamicOptions?: DynamicSelectConfig;
  isMulti?: boolean;
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  accept?: string;
  multiple?: boolean;
  uploadSourceId?: string; // Reference to FileUploadSource id for automatic upload
}

export interface DropzoneFieldConfig extends BaseFieldConfig {
  type: "dropzone";
  accept?: string; // File type filter (e.g., "image/*", ".pdf,.doc")
  multiple?: boolean; // Allow multiple files
  maxSize?: number; // Maximum file size in bytes
  maxFiles?: number; // Maximum number of files (for multiple mode)
  uploadSourceId?: string; // Reference to FileUploadSource id for automatic upload
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: SelectOption[];
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
  checkboxLabel?: string;
}

export interface PhoneFieldConfig extends BaseFieldConfig {
  type: "phone";
  defaultCountry?: string; // ISO 3166-1 alpha-2 country code (e.g., "BD", "US", "GB")
}

export interface PasswordFieldConfig extends BaseFieldConfig {
  type: "password";
  showToggle?: boolean; // Show/hide password toggle button (default: true)
}

export interface ProfilePictureFieldConfig extends BaseFieldConfig {
  type: "profilePicture";
  accept?: string; // File type filter (default: "image/*")
  maxSize?: number; // Maximum file size in bytes
  uploadConfig?: FileUploadConfig; // API upload configuration (inline)
  uploadSourceId?: string; // Reference to FileUploadSource id (alternative to uploadConfig)
}

export type FieldConfig =
  | TextFieldConfig
  | TextareaFieldConfig
  | NumberFieldConfig
  | DateFieldConfig
  | SelectFieldConfig
  | FileFieldConfig
  | DropzoneFieldConfig
  | RadioFieldConfig
  | CheckboxFieldConfig
  | PhoneFieldConfig
  | PasswordFieldConfig
  | ProfilePictureFieldConfig;

// Section and Step types
export interface FormSection {
  title?: string;
  description?: string;
  dataSourceId?: string; // Data source for all fields in this section
  fields: FieldConfig[];
  cols?: number; // Grid columns for the section
  className?: string; // Custom class for the section container
  headerClassName?: string; // Custom class for the section header
  fieldsClassName?: string; // Custom class for the fields grid container

  // Nested field grouping - groups all fields in this section under a parent key
  fieldGroup?: string; // e.g., "businessInformation" will create nested structure

  // Repeatable section (Field Array)
  repeatable?: boolean; // Can this section be repeated?
  repeatableConfig?: {
    addButtonText?: string; // "Add Experience", "Add Education", etc.
    removeButtonText?: string; // "Remove"
    initialItems?: number; // Number of items to show when form loads (default: minItems)
    minItems?: number; // Minimum items required (cannot remove below this)
    maxItems?: number; // Maximum items allowed
    defaultItem?: Record<string, any>; // Default values for new item
    itemClassName?: string; // Custom class for each repeatable item container
    addButtonClassName?: string; // Custom class for the add button
    removeButtonClassName?: string; // Custom class for the remove button
  };

  // Conditional logic for sections
  showWhen?: Condition;
  hideWhen?: Condition;

  // Clear all fields in this section when it becomes hidden
  clearOnHide?: boolean;
}

export interface FormStep {
  title: string;
  description?: string;
  dataSourceId?: string; // Data source for all fields in this step
  sections?: FormSection[];
  fields?: FieldConfig[];
  className?: string; // Custom class for the step container
  headerClassName?: string; // Custom class for the step header
  contentClassName?: string; // Custom class for the step content area

  // Conditional logic for steps
  showWhen?: Condition;
  hideWhen?: Condition;
}

// Main form schema
export interface FormSchema {
  dataSources?: DataSource[]; // API data sources for read-only fields
  uploadSources?: FileUploadSource[]; // File upload sources for file fields
  steps?: FormStep[];
  sections?: FormSection[];
  fields?: FieldConfig[];
  validationSchema?: z.ZodSchema<any>;
  defaultValues?: Record<string, any>;
}

// Form Engine props
export interface FormEngineProps {
  schema: FormSchema;
  onSubmit: (data: any) => void | Promise<void>;
  className?: string; // Custom class for the form element
  stepperClassName?: string; // Custom class for the stepper navigation
  contentClassName?: string; // Custom class for the form content area
  navigationClassName?: string; // Custom class for the navigation buttons container
  submitButtonClassName?: string; // Custom class for the submit button
  prevButtonClassName?: string; // Custom class for the previous button
  submitButtonText?: string;
  showStepNavigation?: boolean;
}
