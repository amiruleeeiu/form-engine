/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Check, ChevronLeft, ChevronRight } from "../../assets/icons/index.js";
import { useDataSources } from "../../hooks/useDataSources.js";
import type {
  FieldConfig,
  FileUploadSource,
  FormEngineProps,
} from "../../types/index.js";
import { cn } from "../../utils/cn.js";
import {
  getWatchedFields,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { mergeDefaultValues } from "../../utils/defaultValues.js";
import { FieldRenderer } from "./FieldRenderer.js";
import { FormSection } from "./FormSection.js";

// Context to share data source state with child components
export const DataSourceContext = createContext<ReturnType<
  typeof useDataSources
> | null>(null);

// Context to share upload sources and data sources with child components
export const FormContext = createContext<{
  uploadSources?: FileUploadSource[];
  dataSourceState: ReturnType<typeof useDataSources>;
} | null>(null);

export const FormEngine: React.FC<FormEngineProps> = ({
  schema,
  onSubmit,
  className,
  stepperClassName,
  contentClassName,
  navigationClassName,
  submitButtonClassName,
  prevButtonClassName,
  submitButtonText = "Submit",
  showStepNavigation = true,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Fetch data from API sources
  const dataSourceState = useDataSources(schema.dataSources);

  // Merge default values from fields with user-provided defaults
  const defaultValues = useMemo(
    () => mergeDefaultValues(schema, schema.defaultValues),
    [schema]
  );

  const methods = useForm({
    resolver: schema.validationSchema
      ? zodResolver(schema.validationSchema as any)
      : undefined,
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { handleSubmit, watch, setValue, trigger } = methods;

  // Build a map of field dependencies (which fields depend on which)
  const fieldDependencies = useMemo(() => {
    const deps = new Map<string, string[]>();

    const extractFields = (fields: FieldConfig[], prefix = "") => {
      fields.forEach((field) => {
        const fieldPath = prefix ? `${prefix}.${field.name}` : field.name;

        // Check if this field has dynamicOptions with dependsOn
        if (field.type === "select" && field.dynamicOptions?.dependsOn) {
          const parentField =
            field.dynamicOptions.dependsOnPath ||
            field.dynamicOptions.dependsOn;

          if (!deps.has(parentField)) {
            deps.set(parentField, []);
          }
          deps.get(parentField)!.push(fieldPath);
        }
      });
    };

    // Extract from steps
    if (schema.steps) {
      schema.steps.forEach((step) => {
        step.sections?.forEach((section) => {
          extractFields(section.fields, section.fieldGroup);
        });
        if (step.fields) {
          extractFields(step.fields);
        }
      });
    }

    // Extract from sections
    if (schema.sections) {
      schema.sections.forEach((section) => {
        extractFields(section.fields, section.fieldGroup);
      });
    }

    // Extract from fields
    if (schema.fields) {
      extractFields(schema.fields);
    }

    return deps;
  }, [schema]);

  // Track previous field values to detect changes
  const prevValuesRef = useRef<Record<string, any>>({});

  // Watch all fields that have dependents
  const fieldsToWatch = Array.from(fieldDependencies.keys());
  const watchedFieldValues = watch(fieldsToWatch);

  // Auto-clear dependent fields when parent field changes
  useEffect(() => {
    fieldsToWatch.forEach((fieldName, index) => {
      const currentValue = watchedFieldValues[index];
      const prevValue = prevValuesRef.current[fieldName];

      // If value changed (including cleared), clear dependent fields
      if (prevValue !== undefined && currentValue !== prevValue) {
        const dependentFields = fieldDependencies.get(fieldName) || [];

        if (dependentFields.length > 0) {
          console.log(
            `Field "${fieldName}" changed, clearing dependents:`,
            dependentFields
          );
          dependentFields.forEach((depField) => {
            setValue(depField, null, {
              shouldValidate: false,
              shouldDirty: false,
            });
          });
        }
      }

      // Update tracked value
      prevValuesRef.current[fieldName] = currentValue;
    });
  }, [watchedFieldValues, fieldsToWatch, fieldDependencies, setValue]);

  // Determine if we're using steps
  const hasSteps = schema.steps && schema.steps.length > 0;

  // Filter visible steps based on conditional logic
  const visibleSteps = useMemo(() => {
    if (!hasSteps || !schema.steps) return [];

    return schema.steps.filter((step) => {
      if (!step.showWhen && !step.hideWhen) return true;

      const watchFields = new Set<string>();
      [step.showWhen, step.hideWhen].forEach((condition) => {
        getWatchedFields(condition).forEach((field) => watchFields.add(field));
      });

      const watchedValues = Array.from(watchFields).map((field) =>
        watch(field)
      );
      const valueMap: Record<string, any> = {};
      Array.from(watchFields).forEach((field, index) => {
        valueMap[field] = watchedValues[index];
      });

      const showField = step.showWhen?.field
        ? valueMap[step.showWhen.field]
        : undefined;
      const hideField = step.hideWhen?.field
        ? valueMap[step.hideWhen.field]
        : undefined;
      return shouldShowField(
        step.showWhen,
        step.hideWhen,
        step.showWhen ? showField : hideField
      );
    });
  }, [hasSteps, schema.steps, watch]);

  const currentStepData = visibleSteps[currentStep];
  const isLastStep = currentStep === visibleSteps.length - 1;
  const isFirstStep = currentStep === 0;

  // Get all field names in the current step
  const getCurrentStepFields = (): string[] => {
    if (!currentStepData) return [];

    const fields: string[] = [];

    // Fields in sections
    if (currentStepData.sections) {
      currentStepData.sections.forEach((section) => {
        section.fields.forEach((field) => {
          const fieldPath = section.fieldGroup
            ? `${section.fieldGroup}.${field.name}`
            : field.name;
          fields.push(fieldPath);
        });
      });
    }

    // Direct fields
    if (currentStepData.fields) {
      currentStepData.fields.forEach((field) => {
        fields.push(field.name);
      });
    }

    return fields;
  };

  const handleNext = async () => {
    if (isLastStep) return;

    // Trigger validation for current step fields
    const currentFields = getCurrentStepFields();

    if (currentFields.length > 0) {
      const isValid = await trigger(currentFields, { shouldFocus: true });
      if (!isValid) {
        // Validation failed, don't proceed
        console.log("Validation failed for fields:", currentFields);
        return;
      }
    }

    // Validation passed, move to next step
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onFormSubmit = async (data: any) => {
    if (hasSteps && !isLastStep) {
      await handleNext();
    } else {
      await onSubmit(data);
    }
  };

  const formContextValue = useMemo(
    () => ({
      uploadSources: schema.uploadSources,
      dataSourceState,
    }),
    [schema.uploadSources, dataSourceState]
  );

  return (
    <FormContext.Provider value={formContextValue}>
      <DataSourceContext.Provider value={dataSourceState}>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className={cn("space-y-6", className)}
          >
            {" "}
            {/* Stepper Header */}
            {hasSteps && showStepNavigation && visibleSteps.length > 1 && (
              <div
                className={cn(
                  "bg-slate-50 rounded-lg py-3 px-3 sm:py-4 sm:px-6 mb-8",
                  stepperClassName
                )}
              >
                {/* Steps Grid Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {visibleSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 relative cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        {/* Checkmark for completed steps */}
                        {index < currentStep && (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span
                            className={cn(
                              "text-[9px] sm:text-[10px] font-medium uppercase tracking-wide",
                              index === currentStep
                                ? "text-blue-600"
                                : index < currentStep
                                ? "text-teal-600"
                                : "text-gray-400"
                            )}
                          >
                            Step {index + 1}
                          </span>
                          <span
                            className={cn(
                              "text-xs sm:text-sm font-semibold transition-colors duration-200 truncate",
                              index === currentStep
                                ? "text-blue-600"
                                : index < currentStep
                                ? "text-teal-600"
                                : "text-gray-500"
                            )}
                            title={step.title}
                          >
                            {step.title}
                          </span>
                        </div>
                      </div>
                      {/* Progress indicator under each step */}
                      <div
                        className={cn(
                          "h-1 w-full rounded-full transition-all duration-300",
                          index === currentStep
                            ? "bg-blue-500"
                            : index < currentStep
                            ? "bg-teal-500"
                            : "bg-gray-200"
                        )}
                      />
                      {/* Arrow indicator on right side */}
                      {index < visibleSteps.length - 1 && (
                        <ChevronRight
                          className={cn(
                            "absolute -right-2 top-3 sm:top-4 w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-200",
                            index === currentStep
                              ? "text-blue-500"
                              : index < currentStep
                              ? "text-teal-500"
                              : "text-gray-300"
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Step/Form Content */}
            {hasSteps ? (
              <div className={cn("space-y-6", contentClassName)}>
                {currentStepData && (
                  <div className={currentStepData.className}>
                    {" "}
                    <div
                      className={cn("mb-6", currentStepData.headerClassName)}
                    >
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {currentStepData.title}
                      </h2>
                      {currentStepData.description && (
                        <p className="text-base text-gray-600">
                          {currentStepData.description}
                        </p>
                      )}
                    </div>{" "}
                    {/* Sections within step */}
                    <div className={currentStepData.contentClassName}>
                      {currentStepData.sections &&
                      currentStepData.sections.length > 0
                        ? currentStepData.sections.map((section, idx) => (
                            <FormSection
                              key={idx}
                              section={section}
                              sectionIndex={idx}
                            />
                          ))
                        : null}{" "}
                      {/* Fields directly in step */}
                      {currentStepData.fields &&
                        currentStepData.fields.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentStepData.fields.map((field) => (
                              <div
                                key={field.name}
                                className={cn(
                                  field.cols === 12 || field.cols === 2
                                    ? "md:col-span-2"
                                    : "md:col-span-1",
                                  field.cols === 6 || field.cols === 1
                                    ? "md:col-span-1"
                                    : ""
                                )}
                              >
                                <FieldRenderer field={field} />
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={cn("space-y-6", contentClassName)}>
                {" "}
                {/* Sections */}
                {schema.sections && schema.sections.length > 0
                  ? schema.sections.map((section, idx) => (
                      <FormSection
                        key={idx}
                        section={section}
                        sectionIndex={idx}
                      />
                    ))
                  : null}{" "}
                {/* Fields */}
                {schema.fields && schema.fields.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {schema.fields.map((field) => (
                      <div
                        key={field.name}
                        className={cn(
                          field.cols === 12 || field.cols === 2
                            ? "md:col-span-2"
                            : "md:col-span-1",
                          field.cols === 6 || field.cols === 1
                            ? "md:col-span-1"
                            : ""
                        )}
                      >
                        <FieldRenderer field={field} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Navigation Buttons */}
            <div
              className={cn(
                "flex justify-between items-center pt-6 mt-6 border-t border-gray-200",
                navigationClassName
              )}
            >
              {hasSteps && !isFirstStep ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 shadow-sm",
                    prevButtonClassName
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-md hover:shadow-lg",
                  submitButtonClassName
                )}
              >
                {hasSteps && !isLastStep ? (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  submitButtonText
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      </DataSourceContext.Provider>
    </FormContext.Provider>
  );
};
