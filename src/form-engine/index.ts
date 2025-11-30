// Main component
export { FormEngine } from "./components/core/FormEngine";

// Types
export * from "./types/index";

// Utilities
export { cn } from "./utils/cn";
export {
  evaluateCondition,
  getWatchedFields,
  shouldEnableField,
  shouldShowField,
} from "./utils/conditionalLogic";
export {
  extractDefaultValues,
  mergeDefaultValues,
} from "./utils/defaultValues";
export { useDynamicOptions } from "./utils/dynamicOptions";
export { getValidationRules } from "./utils/fieldValidation";
export {
  convertJSONToFormSchema,
  validateJSONSchema,
} from "./utils/jsonSchemaConverter";
