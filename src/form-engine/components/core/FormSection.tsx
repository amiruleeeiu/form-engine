import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { FormSection as FormSectionType } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import {
  getWatchedFields,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { FieldRenderer } from "./FieldRenderer.js";
import { RepeatableSection } from "./RepeatableSection.js";

interface FormSectionProps {
  section: FormSectionType;
  sectionIndex?: number; // Used for generating unique names for repeatable sections
}

export const FormSection: React.FC<FormSectionProps> = ({
  section,
  sectionIndex = 0,
}) => {
  const { watch } = useFormContext();

  // Get all fields that need to be watched for section visibility
  const watchFields = useMemo(() => {
    const fields = new Set<string>();
    [section.showWhen, section.hideWhen].forEach((condition) => {
      getWatchedFields(condition).forEach((field) => fields.add(field));
    });
    return Array.from(fields);
  }, [section.showWhen, section.hideWhen]);

  // Watch the dependent fields
  const watchedValues = watch(watchFields);

  // Build a map of field values for evaluation
  const valueMap = useMemo(() => {
    const map: Record<string, any> = {};
    watchFields.forEach((field, index) => {
      map[field] = watchedValues[index];
    });
    return map;
  }, [watchFields, watchedValues]);

  // Evaluate visibility
  const isVisible = useMemo(() => {
    const showField = section.showWhen?.field
      ? valueMap[section.showWhen.field]
      : undefined;
    const hideField = section.hideWhen?.field
      ? valueMap[section.hideWhen.field]
      : undefined;
    return shouldShowField(
      section.showWhen,
      section.hideWhen,
      section.showWhen ? showField : hideField
    );
  }, [section.showWhen, section.hideWhen, valueMap]);
  if (!isVisible) return null;

  // Check if this is a repeatable section
  if (section.repeatable) {
    // Generate a unique name for this repeatable section
    const sectionName =
      section.title?.toLowerCase().replace(/\s+/g, "_") ||
      `section_${sectionIndex}`;

    return <RepeatableSection section={section} sectionName={sectionName} />;
  }

  return (
    <div className={cn("mb-8", section.className)}>
      {section.title && (
        <div
          className={cn(
            "border-b-2 border-blue-100 pb-3 mb-6",
            section.headerClassName
          )}
        >
          <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
          {section.description && (
            <p className="text-sm text-gray-600 mt-2">{section.description}</p>
          )}
        </div>
      )}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-3",
          section.fieldsClassName
        )}
      >
        {section.fields.map((field) => (
          <div
            key={field.name}
            className={cn(
              field.cols === 12 || field.cols === 2
                ? "md:col-span-2"
                : "md:col-span-1",
              field.cols === 6 || field.cols === 1 ? "md:col-span-1" : ""
            )}
          >
            <FieldRenderer field={field} />
          </div>
        ))}
      </div>
    </div>
  );
};
