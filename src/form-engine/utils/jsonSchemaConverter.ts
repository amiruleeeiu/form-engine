import type {
  FieldConfig,
  FormSchema,
  FormSection,
  FormStep,
} from "../types/index.js";

/**
 * Convert JSON schema to BSA Form Engine schema
 * JSON format থেকে Form Engine এর format এ convert করে
 */

interface JSONField {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  width?: string;
  sort_order?: string;
  validation?: {
    required?: boolean;
    pattern?: any;
  };
  data_source?: {
    type: string;
    options?: Array<{ label: string; value: string }>;
  };
  repeatable?: boolean;
}

interface JSONSection {
  id: string;
  title?: string;
  description?: string;
  step?: string;
  repeatable?: boolean;
  listConfig?: {
    add_button_text?: string;
    show_table?: boolean;
    min_entries?: number;
    max_entries?: number;
  } | null;
  fields: JSONField[];
}

interface JSONSchema {
  metadata?: {
    form_key?: string;
    form_tag?: string;
    version?: string;
    title?: string;
  };
  ui?: {
    template?: string;
    show_progress?: boolean;
    show_header?: boolean;
    steps?: Array<{
      id: string;
      title: string;
    }>;
  };
  sections: JSONSection[];
}

/**
 * Map field width to cols
 */
function mapWidth(width?: string): number {
  if (width === "full") return 2;
  return 1; // half is default
}

/**
 * Map field type
 */
function mapFieldType(type: string): FieldConfig["type"] {
  const typeMap: Record<string, FieldConfig["type"]> = {
    text: "text",
    email: "text",
    tel: "text",
    nid: "text",
    tin: "text",
    dob: "date",
    address: "text",
    bd_address: "text",
    textarea: "text",
    select: "select",
    radio: "radio",
    number: "number",
    file: "file",
    checkbox: "checkbox",
  };

  return typeMap[type] || "text";
}

/**
 * Convert JSON field to FormEngine field
 */
function convertField(jsonField: JSONField): FieldConfig {
  const field: any = {
    name: jsonField.name,
    label: jsonField.label,
    type: mapFieldType(jsonField.type),
    placeholder: jsonField.placeholder || "Enter",
    cols: mapWidth(jsonField.width),
  };

  // Add validation
  if (jsonField.validation) {
    field.validation = {};

    if (jsonField.validation.required) {
      field.validation.required = `${jsonField.label} is required`;
    }

    // Email validation
    if (jsonField.type === "email") {
      field.validation.email = "Please enter a valid email address";
    }

    // Phone validation
    if (jsonField.type === "tel") {
      field.validation.pattern = {
        value: /^[0-9]{11}$/,
        message: "Phone must be 11 digits",
      };
    }
  }

  // Add options for select/radio
  if (jsonField.data_source?.options) {
    field.options = jsonField.data_source.options;
  }

  return field as FieldConfig;
}

/**
 * Convert JSON section to FormEngine section
 */
function convertSection(jsonSection: JSONSection): FormSection {
  const section: FormSection = {
    title: jsonSection.title,
    description: jsonSection.description || "",
    fields: jsonSection.fields.map(convertField),
  };

  // Handle repeatable sections
  if (jsonSection.repeatable && jsonSection.listConfig) {
    section.repeatable = true;
    section.repeatableConfig = {
      addButtonText: jsonSection.listConfig.add_button_text || "Add Item",
      removeButtonText: "Remove",
      initialItems: jsonSection.listConfig.min_entries || 1,
      minItems: jsonSection.listConfig.min_entries || 1,
      maxItems: jsonSection.listConfig.max_entries || 10,
    };
  }

  return section;
}

/**
 * Main conversion function
 */
export function convertJSONToFormSchema(jsonSchema: any): FormSchema {
  // Check if it's already in FormSchema format (has steps array with sections)
  if (jsonSchema.steps && Array.isArray(jsonSchema.steps)) {
    // It's already in the correct format, just return it
    return jsonSchema as FormSchema;
  }

  // Otherwise, convert from JSON format
  const typedSchema = jsonSchema as JSONSchema;

  // Check if we have steps
  const hasSteps = typedSchema.ui?.steps && typedSchema.ui.steps.length > 0;

  if (!hasSteps) {
    // Simple form without steps
    return {
      sections: typedSchema.sections.map(convertSection),
    };
  }

  // Form with steps
  const stepsMap = new Map<string, FormStep>();

  // Initialize steps
  typedSchema.ui!.steps!.forEach((step) => {
    stepsMap.set(step.id, {
      title: step.title,
      description: "",
      sections: [],
    });
  });

  // Group sections by step
  typedSchema.sections.forEach((section) => {
    if (section.step) {
      const step = stepsMap.get(section.step);
      if (step) {
        if (!step.sections) {
          step.sections = [];
        }
        step.sections.push(convertSection(section));
      }
    }
  });

  return {
    steps: Array.from(stepsMap.values()).filter(
      (step) => step.sections && step.sections.length > 0
    ),
  };
}

/**
 * Validate JSON schema
 */
export function validateJSONSchema(jsonString: string): {
  valid: boolean;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);

    // Check if it's already in FormSchema format (has steps array)
    if (parsed.steps && Array.isArray(parsed.steps)) {
      // Validate steps structure
      for (const step of parsed.steps) {
        if (!step.title) {
          return { valid: false, error: "Each step must have a 'title'" };
        }
        // Check if step has sections or fields
        if (!step.sections && !step.fields) {
          return {
            valid: false,
            error: "Each step must have 'sections' or 'fields'",
          };
        }
      }
      return { valid: true };
    }

    // Otherwise validate JSON format (must have sections)
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      return {
        valid: false,
        error: "Schema must have 'sections' array or 'steps' array",
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}
