import { useState } from "react";
import { JSONSchemaEditor } from "./components/JSONSchemaEditor.js";
import { businessRegistrationSchema } from "./examples/businessRegistrationSchema.js";
import { conditionalLogicFormSchema } from "./examples/conditionalLogicSchema.js";
import { apiDrivenFormSchema } from "./examples/dynamicSelectSchema.js";
import { fieldLevelValidationSchema } from "./examples/fieldLevelValidationSchema.js";
import {
  mixedStepperSchema,
  simpleFieldsOnlySchema,
  simpleSectionsOnlySchema,
  stepperWithFieldsSchema,
  stepperWithSectionsSchema,
} from "./examples/flexibleFormSchema.js";
import { simpleFormSchema } from "./examples/simpleFormSchema.js";
import { stepperFormSchema } from "./examples/stepperFormSchema.js";
import { FormEngine } from "./form-engine/index.js";

type ViewMode = "examples" | "jsonEditor";

type FormType =
  | "simple"
  | "stepper"
  | "conditional"
  | "dynamic"
  | "fieldsOnly"
  | "sectionsOnly"
  | "stepperFields"
  | "stepperSections"
  | "mixed"
  | "fieldValidation"
  | "businessRegistration";

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("examples");
  const [selectedForm, setSelectedForm] = useState<FormType>("simple");
  const [submittedData, setSubmittedData] = useState<Record<
    string,
    unknown
  > | null>(null);

  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log("Form submitted:", data);
    setSubmittedData(data);
    alert("Form submitted successfully! Check console for data.");
  };

  const getSchema = () => {
    switch (selectedForm) {
      case "stepper":
        return stepperFormSchema;
      case "conditional":
        return conditionalLogicFormSchema;
      case "dynamic":
        return apiDrivenFormSchema;
      case "fieldsOnly":
        return simpleFieldsOnlySchema;
      case "sectionsOnly":
        return simpleSectionsOnlySchema;
      case "stepperFields":
        return stepperWithFieldsSchema;
      case "stepperSections":
        return stepperWithSectionsSchema;
      case "mixed":
        return mixedStepperSchema;
      case "fieldValidation":
        return fieldLevelValidationSchema;
      case "businessRegistration":
        return businessRegistrationSchema;
      default:
        return simpleFormSchema;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Form Engine Demo
          </h1>
          <p className="text-xl text-gray-600">
            Built with React Hook Form, Zod, Tailwind CSS, and React Select
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="form-container mb-6 p-2">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setViewMode("examples")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                viewMode === "examples"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📋 Form Examples
            </button>
            <button
              onClick={() => setViewMode("jsonEditor")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                viewMode === "jsonEditor"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🔧 JSON Schema Editor
            </button>
          </div>
        </div>

        {/* JSON Schema Editor View */}
        {viewMode === "jsonEditor" && <JSONSchemaEditor />}

        {/* Form Examples View */}
        {viewMode === "examples" && (
          <>
            {/* Form Type Selector */}
            <div className="form-container mb-6 p-2">
              <div className="p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                  Select Form Example:
                </label>

                {/* Main Examples */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    Main Examples:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <button
                      onClick={() => setSelectedForm("simple")}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        selectedForm === "simple"
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Simple Form
                    </button>
                    <button
                      onClick={() => setSelectedForm("stepper")}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        selectedForm === "stepper"
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Multi-Step
                    </button>
                    <button
                      onClick={() => setSelectedForm("conditional")}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        selectedForm === "conditional"
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Conditional
                    </button>
                    <button
                      onClick={() => setSelectedForm("dynamic")}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        selectedForm === "dynamic"
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Dynamic API
                    </button>
                    <button
                      onClick={() => setSelectedForm("fieldValidation")}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        selectedForm === "fieldValidation"
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Field Validation
                    </button>
                  </div>
                </div>

                {/* Real-World Example */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    📋 Real-World Example:
                  </p>
                  <div className="grid grid-cols-1">
                    <button
                      onClick={() => setSelectedForm("businessRegistration")}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        selectedForm === "businessRegistration"
                          ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg"
                          : "bg-gradient-to-r from-green-50 to-blue-50 text-gray-700 hover:from-green-100 hover:to-blue-100 border-2 border-green-200"
                      }`}
                    >
                      🏢 Business Registration Form (6 Steps + Repeatable)
                    </button>
                  </div>
                </div>

                {/* Structure Variations */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    Structure Variations:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <button
                      onClick={() => setSelectedForm("fieldsOnly")}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                        selectedForm === "fieldsOnly"
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Fields Only
                    </button>
                    <button
                      onClick={() => setSelectedForm("sectionsOnly")}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                        selectedForm === "sectionsOnly"
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Sections Only
                    </button>
                    <button
                      onClick={() => setSelectedForm("stepperFields")}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                        selectedForm === "stepperFields"
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Steps + Fields
                    </button>
                    <button
                      onClick={() => setSelectedForm("stepperSections")}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                        selectedForm === "stepperSections"
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Steps + Sections
                    </button>
                    <button
                      onClick={() => setSelectedForm("mixed")}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                        selectedForm === "mixed"
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Mixed
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Structure Info */}
            {[
              "fieldsOnly",
              "sectionsOnly",
              "stepperFields",
              "stepperSections",
              "mixed",
              "fieldValidation",
            ].includes(selectedForm) && (
              <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <h3 className="text-sm font-bold text-blue-900 mb-2">
                  {selectedForm === "fieldValidation"
                    ? "🎯 Validation Type:"
                    : "📋 Structure Type:"}
                </h3>
                <p className="text-sm text-blue-800">
                  {selectedForm === "fieldsOnly" &&
                    "✓ Direct fields without sections - সরাসরি fields, কোনো section নেই"}
                  {selectedForm === "sectionsOnly" &&
                    "✓ Organized with sections - sections এ organize করা"}
                  {selectedForm === "stepperFields" &&
                    "✓ Multi-step with direct fields - step এ সরাসরি fields"}
                  {selectedForm === "stepperSections" &&
                    "✓ Multi-step with sections inside - step এর ভিতরে sections"}
                  {selectedForm === "mixed" &&
                    "✓ Mixed approach - কিছু step এ fields, কিছুতে sections"}
                  {selectedForm === "fieldValidation" &&
                    "✓ Field-level validation - Zod schema ছাড়াই validation! প্রতিটি field এ আলাদা validation দেওয়া আছে"}
                </p>
              </div>
            )}

            {/* Form Container */}
            <div className="form-container p-8 md:p-10">
              <FormEngine
                key={selectedForm}
                schema={getSchema()}
                onSubmit={handleSubmit}
                submitButtonText="Submit Form"
              />
            </div>

            {/* Submitted Data Display */}
            {submittedData && (
              <div className="mt-6 form-container p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ✓ Form Submitted Successfully!
                </h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <p className="text-sm font-medium text-green-800 mb-3">
                    Submitted Data:
                  </p>
                  <pre className="bg-white p-4 rounded-lg overflow-auto text-sm text-gray-800 shadow-inner">
                    {JSON.stringify(submittedData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
