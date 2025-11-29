import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { FormEngineProps } from "../../types/index.js";
import {
  getWatchedFields,
  shouldShowField,
} from "../../utils/conditionalLogic.js";
import { mergeDefaultValues } from "../../utils/defaultValues.js";
import { FieldRenderer } from "./FieldRenderer.js";
import { FormSection } from "./FormSection.js";

export const FormEngine: React.FC<FormEngineProps> = ({
  schema,
  onSubmit,
  className = "",
  submitButtonText = "Submit",
  showStepNavigation = true,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Merge default values from fields with user-provided defaults
  const defaultValues = useMemo(
    () => mergeDefaultValues(schema, schema.defaultValues),
    [schema]
  );

  const methods = useForm({
    resolver: schema.validationSchema
      ? zodResolver(schema.validationSchema)
      : undefined,
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, watch } = methods;

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

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onFormSubmit = async (data: any) => {
    if (hasSteps && !isLastStep) {
      handleNext();
    } else {
      await onSubmit(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={`space-y-6 ${className}`}
      >
        {" "}
        {/* Stepper Header */}
        {hasSteps && showStepNavigation && visibleSteps.length > 1 && (
          <div className="flex items-center justify-between mb-10 px-4">
            {visibleSteps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-all duration-300 ${
                      index === currentStep
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-4 ring-blue-200 scale-110"
                        : index < currentStep
                        ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index < currentStep ? "✓" : index + 1}
                  </div>
                  <span
                    className={`text-xs mt-3 font-semibold text-center transition-colors duration-300 ${
                      index === currentStep
                        ? "text-blue-700"
                        : index < currentStep
                        ? "text-green-700"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < visibleSteps.length - 1 && (
                  <div
                    className={`h-1.5 flex-1 mx-3 rounded-full transition-all duration-500 ${
                      index < currentStep
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        {/* Step/Form Content */}
        {hasSteps ? (
          <div className="space-y-6">
            {currentStepData && (
              <>
                {" "}
                <div className="mb-6">
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
                {currentStepData.sections && currentStepData.sections.length > 0
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
                          className={`
                          ${
                            field.cols === 12 || field.cols === 2
                              ? "md:col-span-2"
                              : "md:col-span-1"
                          }
                          ${
                            field.cols === 6 || field.cols === 1
                              ? "md:col-span-1"
                              : ""
                          }
                        `}
                        >
                          <FieldRenderer field={field} />
                        </div>
                      ))}
                    </div>
                  )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {" "}
            {/* Sections */}
            {schema.sections && schema.sections.length > 0
              ? schema.sections.map((section, idx) => (
                  <FormSection key={idx} section={section} sectionIndex={idx} />
                ))
              : null}{" "}
            {/* Fields */}
            {schema.fields && schema.fields.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schema.fields.map((field) => (
                  <div
                    key={field.name}
                    className={`
                      ${
                        field.cols === 12 || field.cols === 2
                          ? "md:col-span-2"
                          : "md:col-span-1"
                      }
                      ${
                        field.cols === 6 || field.cols === 1
                          ? "md:col-span-1"
                          : ""
                      }
                    `}
                  >
                    <FieldRenderer field={field} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8 mt-8 border-t-2 border-gray-100">
          {hasSteps && !isFirstStep ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-8 py-3 border-2 border-gray-300 rounded-lg shadow-sm text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200"
            >
              ← Previous
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="px-8 py-3 border-2 border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200"
          >
            {hasSteps && !isLastStep ? "Next →" : submitButtonText}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
