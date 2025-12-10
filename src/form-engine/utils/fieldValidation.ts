/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldValidation } from "../types/index.js";

/**
 * Convert field-level validation config to React Hook Form validation rules
 */
export function getValidationRules(validation?: FieldValidation) {
  if (!validation) return {};

  const rules: Record<string, any> = {};

  // Required validation
  if (validation.required !== undefined) {
    if (typeof validation.required === "string") {
      rules.required = validation.required;
    } else if (validation.required === true) {
      rules.required = "This field is required";
    }
  }

  // Min length validation
  if (validation.minLength !== undefined) {
    if (typeof validation.minLength === "number") {
      rules.minLength = {
        value: validation.minLength,
        message: `Minimum length is ${validation.minLength} characters`,
      };
    } else {
      rules.minLength = {
        value: validation.minLength.value,
        message:
          validation.minLength.message ||
          `Minimum length is ${validation.minLength.value} characters`,
      };
    }
  }

  // Max length validation
  if (validation.maxLength !== undefined) {
    if (typeof validation.maxLength === "number") {
      rules.maxLength = {
        value: validation.maxLength,
        message: `Maximum length is ${validation.maxLength} characters`,
      };
    } else {
      rules.maxLength = {
        value: validation.maxLength.value,
        message:
          validation.maxLength.message ||
          `Maximum length is ${validation.maxLength.value} characters`,
      };
    }
  }

  // Min value validation (for numbers)
  if (validation.min !== undefined) {
    if (typeof validation.min === "number") {
      rules.min = {
        value: validation.min,
        message: `Minimum value is ${validation.min}`,
      };
    } else {
      rules.min = {
        value: validation.min.value,
        message:
          validation.min.message || `Minimum value is ${validation.min.value}`,
      };
    }
  }

  // Max value validation (for numbers)
  if (validation.max !== undefined) {
    if (typeof validation.max === "number") {
      rules.max = {
        value: validation.max,
        message: `Maximum value is ${validation.max}`,
      };
    } else {
      rules.max = {
        value: validation.max.value,
        message:
          validation.max.message || `Maximum value is ${validation.max.value}`,
      };
    }
  }

  // Pattern validation
  if (validation.pattern) {
    rules.pattern = {
      value: validation.pattern.value,
      message: validation.pattern.message || "Invalid format",
    };
  }

  // Email validation
  if (validation.email !== undefined) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    rules.pattern = {
      value: emailPattern,
      message:
        typeof validation.email === "string"
          ? validation.email
          : "Invalid email address",
    };
  }

  // Custom validation
  if (validation.custom) {
    rules.validate = (value: any) => {
      const result = validation.custom!(value);
      return result === true ? true : result;
    };
  }

  return rules;
}
