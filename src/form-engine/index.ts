// Import styles
import "./styles.css";

// Main component
export { FormEngine } from "./components/core/FormEngine";

// Icons
export {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "./assets/icons/index";

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

// Hooks
export { useClickOutside } from "./hooks/useClickOutside";
export { useDropdownPosition } from "./hooks/useDropdownPosition";
