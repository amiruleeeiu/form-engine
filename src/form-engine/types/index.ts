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

// Field types
export type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "autocomplete"
  | "file"
  | "radio"
  | "checkbox";

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
}

// Base field configuration
export interface BaseFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  cols?: number; // Column span: 1 (half row), 2 or 12 (full row). Default: 1. Mobile is always full width.
  className?: string;
  defaultValue?: any;

  // Field-level validation (optional, can be used with or without Zod schema)
  validation?: FieldValidation;

  // Conditional logic
  showWhen?: Condition;
  hideWhen?: Condition;
  enableWhen?: Condition;
  disableWhen?: Condition;
}

// Specific field configurations
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text";
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
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
}

export interface AutocompleteFieldConfig extends BaseFieldConfig {
  type: "autocomplete";
  options?: SelectOption[];
  dynamicOptions?: DynamicSelectConfig;
  isMulti?: boolean;
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  accept?: string;
  multiple?: boolean;
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: SelectOption[];
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
  checkboxLabel?: string;
}

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | DateFieldConfig
  | SelectFieldConfig
  | AutocompleteFieldConfig
  | FileFieldConfig
  | RadioFieldConfig
  | CheckboxFieldConfig;

// Section and Step types
export interface FormSection {
  title?: string;
  description?: string;
  fields: FieldConfig[];
  cols?: number; // Grid columns for the section
  className?: string;
  // Repeatable section (Field Array)
  repeatable?: boolean; // Can this section be repeated?
  repeatableConfig?: {
    addButtonText?: string; // "Add Experience", "Add Education", etc.
    removeButtonText?: string; // "Remove"
    initialItems?: number; // Number of items to show when form loads (default: minItems)
    minItems?: number; // Minimum items required (cannot remove below this)
    maxItems?: number; // Maximum items allowed
    defaultItem?: Record<string, any>; // Default values for new item
  };

  // Conditional logic for sections
  showWhen?: Condition;
  hideWhen?: Condition;
}

export interface FormStep {
  title: string;
  description?: string;
  sections?: FormSection[];
  fields?: FieldConfig[];

  // Conditional logic for steps
  showWhen?: Condition;
  hideWhen?: Condition;
}

// Main form schema
export interface FormSchema {
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
  className?: string;
  submitButtonText?: string;
  showStepNavigation?: boolean;
}
