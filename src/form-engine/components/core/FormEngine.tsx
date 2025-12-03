import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { FormEngineProps } from "../../types/index.js";
import { cn } from "../../utils/cn.js";
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
        className={cn("space-y-6", className)}
      >
        {" "}
        {/* Stepper Header */}
        {hasSteps && showStepNavigation && visibleSteps.length > 1 && (
          <div
            className={cn(
              "bg-slate-50 rounded-lg py-4 px-6 mb-8",
              stepperClassName
            )}
          >
            <div className="flex items-center justify-between">
              {visibleSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center gap-2">
                    {/* Checkmark for completed steps */}
                    {index < currentStep && (
                      <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "text-[10px] font-medium uppercase tracking-wide",
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
                          "text-sm font-semibold transition-colors duration-200",
                          index === currentStep
                            ? "text-blue-600"
                            : index < currentStep
                            ? "text-teal-600"
                            : "text-gray-500"
                        )}
                      >
                        {step.title}
                      </span>
                    </div>
                  </div>
                  {/* Chevron separator */}
                  {index < visibleSteps.length - 1 && (
                    <div className="flex-1 flex justify-center">
                      <svg
                        className="w-5 h-5 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            {/* Progress bar under current step */}
            <div className="mt-3 flex gap-1">
              {visibleSteps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-300",
                    index === currentStep
                      ? "bg-blue-500"
                      : index < currentStep
                      ? "bg-teal-500"
                      : "bg-gray-200"
                  )}
                />
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
                <div className={cn("mb-6", currentStepData.headerClassName)}>
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
                  <FormSection key={idx} section={section} sectionIndex={idx} />
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
            "flex justify-between items-center pt-8 mt-8 border-t-2 border-gray-100",
            navigationClassName
          )}
        >
          {hasSteps && !isFirstStep ? (
            <button
              type="button"
              onClick={handlePrevious}
              className={cn(
                "px-8 py-3 border-2 border-gray-300 rounded-lg shadow-sm text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200",
                prevButtonClassName
              )}
            >
              ← Previous
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className={cn(
              "px-8 py-3 border-2 border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200",
              submitButtonClassName
            )}
          >
            {hasSteps && !isLastStep ? "Next →" : submitButtonText}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
