/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Condition } from "../types/index.js";

/**
 * Evaluates a condition against a field value
 */
export function evaluateCondition(
  condition: Condition | undefined,
  fieldValue: any
): boolean {
  if (!condition) return true;

  const {
    operator,
    equals,
    notEquals,
    isEmpty,
    isNotEmpty,
    greaterThan,
    lessThan,
  } = condition;

  // Handle shorthand properties
  if (equals !== undefined) {
    return fieldValue === equals;
  }

  if (notEquals !== undefined) {
    return fieldValue !== notEquals;
  }

  if (condition.in !== undefined) {
    return (condition.in as any[]).includes(fieldValue);
  }

  if (condition.notIn !== undefined) {
    return !(condition.notIn as any[]).includes(fieldValue);
  }

  if (isEmpty === true) {
    return (
      fieldValue === null ||
      fieldValue === undefined ||
      fieldValue === "" ||
      (Array.isArray(fieldValue) && fieldValue.length === 0)
    );
  }

  if (isNotEmpty === true) {
    return (
      fieldValue !== null &&
      fieldValue !== undefined &&
      fieldValue !== "" &&
      (!Array.isArray(fieldValue) || fieldValue.length > 0)
    );
  }

  if (greaterThan !== undefined) {
    const numValue = Number(fieldValue);
    return !isNaN(numValue) && numValue > greaterThan;
  }

  if (lessThan !== undefined) {
    const numValue = Number(fieldValue);
    return !isNaN(numValue) && numValue < lessThan;
  }

  // Explicit operator (fallback)
  if (operator) {
    switch (operator) {
      case "equals":
        return fieldValue === condition.equals;
      case "notEquals":
        return fieldValue !== condition.notEquals;
      case "in":
        return condition.in
          ? (condition.in as any[]).includes(fieldValue)
          : false;
      case "notIn":
        return condition.notIn
          ? !(condition.notIn as any[]).includes(fieldValue)
          : true;
      case "isEmpty":
        return (
          fieldValue === null || fieldValue === undefined || fieldValue === ""
        );
      case "isNotEmpty":
        return (
          fieldValue !== null && fieldValue !== undefined && fieldValue !== ""
        );
      case "greaterThan":
        return Number(fieldValue) > (condition.greaterThan || 0);
      case "lessThan":
        return Number(fieldValue) < (condition.lessThan || 0);
      default:
        return true;
    }
  }

  return true;
}

/**
 * Checks if a field should be visible
 */
export function shouldShowField(
  showWhen: Condition | undefined,
  hideWhen: Condition | undefined,
  watchedValue: any
): boolean {
  // If hideWhen is specified and evaluates to true, hide the field
  if (hideWhen) {
    const shouldHide = evaluateCondition(hideWhen, watchedValue);
    if (shouldHide) return false;
  }

  // If showWhen is specified, only show if it evaluates to true
  if (showWhen) {
    return evaluateCondition(showWhen, watchedValue);
  }

  // Default: show the field
  return true;
}

/**
 * Checks if a field should be enabled
 */
export function shouldEnableField(
  enableWhen: Condition | undefined,
  disableWhen: Condition | undefined,
  watchedValue: any
): boolean {
  // If disableWhen is specified and evaluates to true, disable the field
  if (disableWhen) {
    const shouldDisable = evaluateCondition(disableWhen, watchedValue);
    if (shouldDisable) return false;
  }

  // If enableWhen is specified, only enable if it evaluates to true
  if (enableWhen) {
    return evaluateCondition(enableWhen, watchedValue);
  }

  // Default: enable the field
  return true;
}

/**
 * Gets all field names that are referenced in conditions
 */
export function getWatchedFields(condition: Condition | undefined): string[] {
  if (!condition) return [];
  return [condition.field];
}
