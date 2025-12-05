import type { FieldConfig, FormSchema } from "../types/index.js";

/**
 * Extract default values from field configurations
 * Field গুলো থেকে automatically default values collect করে
 */
export function extractDefaultValues(
  schema: FormSchema
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  // Helper function to process fields
  const processFields = (fields: FieldConfig[], fieldGroup?: string) => {
    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        if (fieldGroup) {
          // Create nested object for grouped fields
          if (!defaults[fieldGroup]) {
            defaults[fieldGroup] = {};
          }
          (defaults[fieldGroup] as Record<string, any>)[field.name] =
            field.defaultValue;
        } else {
          defaults[field.name] = field.defaultValue;
        }
      }
    });
  };

  // Process direct fields
  if (schema.fields) {
    processFields(schema.fields);
  } // Helper function to create default item for repeatable section
  const createDefaultItem = (fields: FieldConfig[], fieldGroup?: string) => {
    const item: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        if (fieldGroup) {
          // Create nested object for grouped fields in repeatable items
          if (!item[fieldGroup]) {
            item[fieldGroup] = {};
          }
          item[fieldGroup][field.name] = field.defaultValue;
        } else {
          item[field.name] = field.defaultValue;
        }
      }
    });
    return item;
  };
  // Process sections
  if (schema.sections) {
    schema.sections.forEach((section) => {
      // For repeatable sections, initialize with initialItems or minItems
      if (section.repeatable) {
        const sectionName =
          section.title?.toLowerCase().replace(/\s+/g, "_") || "section";

        // Use initialItems if provided, otherwise fallback to minItems
        const initialCount =
          section.repeatableConfig?.initialItems !== undefined
            ? section.repeatableConfig.initialItems
            : section.repeatableConfig?.minItems || 0;

        // Create array with initialCount number of default items
        const items = [];
        for (let i = 0; i < initialCount; i++) {
          const defaultItem = createDefaultItem(
            section.fields,
            section.fieldGroup
          );
          // Merge with repeatableConfig.defaultItem if provided
          items.push({
            ...defaultItem,
            ...section.repeatableConfig?.defaultItem,
          });
        }
        defaults[sectionName] = items;
      } else {
        processFields(section.fields, section.fieldGroup);
      }
    });
  }

  // Process steps
  if (schema.steps) {
    schema.steps.forEach((step) => {
      // Process direct fields in step
      if (step.fields) {
        processFields(step.fields);
      } // Process sections in step
      if (step.sections) {
        step.sections.forEach((section) => {
          // For repeatable sections, initialize with initialItems or minItems
          if (section.repeatable) {
            const sectionName =
              section.title?.toLowerCase().replace(/\s+/g, "_") || "section";

            // Use initialItems if provided, otherwise fallback to minItems
            const initialCount =
              section.repeatableConfig?.initialItems !== undefined
                ? section.repeatableConfig.initialItems
                : section.repeatableConfig?.minItems || 0;

            // Create array with initialCount number of default items
            const items = [];
            for (let i = 0; i < initialCount; i++) {
              const defaultItem = createDefaultItem(
                section.fields,
                section.fieldGroup
              );
              // Merge with repeatableConfig.defaultItem if provided
              items.push({
                ...defaultItem,
                ...section.repeatableConfig?.defaultItem,
              });
            }
            defaults[sectionName] = items;
          } else {
            processFields(section.fields, section.fieldGroup);
          }
        });
      }
    });
  }

  return defaults;
}

/**
 * Merge user-provided default values with field-level defaults
 * User দেওয়া defaults এর সাথে field থেকে নেওয়া defaults merge করে
 */
export function mergeDefaultValues(
  schema: FormSchema,
  userDefaults?: Record<string, any>
): Record<string, any> {
  const fieldDefaults = extractDefaultValues(schema);

  // User defaults take precedence over field defaults
  return {
    ...fieldDefaults,
    ...userDefaults,
  };
}
