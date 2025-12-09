import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, X } from "../../assets/icons/index.js";
import type { FormSection } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import { FieldRenderer } from "./FieldRenderer.js";

interface RepeatableSectionProps {
  section: FormSection;
  sectionName: string;
}

export const RepeatableSection: React.FC<RepeatableSectionProps> = ({
  section,
  sectionName,
}) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: sectionName,
  });

  const config = section.repeatableConfig || {};
  const {
    addButtonText = "Add Item",
    removeButtonText = "Remove",
    minItems = 0,
    maxItems,
    itemClassName,
    addButtonClassName,
    removeButtonClassName,
  } = config;

  const canAdd = !maxItems || fields.length < maxItems;
  const canRemove = fields.length > minItems;

  const handleAdd = () => {
    if (canAdd) {
      // Get default values for the new item from field defaultValues
      const defaultItem: Record<string, any> = {};
      section.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          defaultItem[field.name] = field.defaultValue;
        }
      });
      // Merge with config's defaultItem if provided
      const itemToAdd = { ...defaultItem, ...config.defaultItem };
      append(itemToAdd);
    }
  };

  const handleRemove = (index: number) => {
    if (canRemove) {
      remove(index);
    }
  };

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

      {/* Repeatable Items */}
      <div className={cn("space-y-6", section.fieldsClassName)}>
        {fields.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "p-6 border-2 border-gray-200 rounded-lg bg-gray-50 hover:border-gray-300 transition-colors",
              itemClassName
            )}
          >
            {/* Item Header with Remove Button */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300">
              <h4 className="text-lg font-semibold text-gray-800">
                {section.title || "Item"} #{index + 1}
              </h4>
              {canRemove && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded transition-colors",
                    removeButtonClassName
                  )}
                  title={removeButtonText}
                >
                  <X size={16} />
                  <span>{removeButtonText}</span>
                </button>
              )}
            </div>

            {/* Item Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field) => {
                // Create a new field config with the array field name
                const arrayFieldName = `${sectionName}.${index}.${field.name}`;
                const arrayField = {
                  ...field,
                  name: arrayFieldName,
                };

                return (
                  <div
                    key={arrayFieldName}
                    className={cn(
                      field.cols === 12 || field.cols === 2
                        ? "md:col-span-2"
                        : "md:col-span-1",
                      field.cols === 6 || field.cols === 1
                        ? "md:col-span-1"
                        : ""
                    )}
                  >
                    <FieldRenderer field={arrayField} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      {canAdd && (
        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            "mt-6 flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 border-2 border-blue-600 rounded transition-colors",
            addButtonClassName
          )}
        >
          <Plus size={18} />
          <span>{addButtonText}</span>
        </button>
      )}

      {/* Min/Max Items Messages */}
      <div className="mt-3 text-sm text-gray-600">
        {minItems > 0 && fields.length < minItems && (
          <p className="text-red-600">
            Minimum {minItems} item{minItems > 1 ? "s" : ""} required
          </p>
        )}
        {maxItems && fields.length >= maxItems && (
          <p className="text-amber-600">Maximum {maxItems} items reached</p>
        )}
      </div>
    </div>
  );
};
