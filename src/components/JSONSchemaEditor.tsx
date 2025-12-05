import Editor from "@monaco-editor/react";
import { useState } from "react";
import { businessRegistrationSchema } from "../examples/businessRegistrationSchema.js";
import { businessStarterPackageSchema } from "../examples/businessStarterPackageSchema.js";
import { conditionalLogicFormSchema } from "../examples/conditionalLogicSchema.js";
import { apiDrivenFormSchema } from "../examples/dynamicSelectSchema.js";
import { fieldLevelValidationSchema } from "../examples/fieldLevelValidationSchema.js";
import {
  mixedStepperSchema,
  simpleFieldsOnlySchema,
  simpleSectionsOnlySchema,
  stepperWithFieldsSchema,
  stepperWithSectionsSchema,
} from "../examples/flexibleFormSchema.js";
import { repeatableSectionSchema } from "../examples/repeatableSectionSchema.js";
import { simpleFormSchema } from "../examples/simpleFormSchema.js";
import { stepperFormSchema } from "../examples/stepperFormSchema.js";
import { FormEngine } from "../form-engine/index.js";
import type { FormSchema } from "../form-engine/types/index.js";
import {
  convertJSONToFormSchema,
  validateJSONSchema,
} from "../form-engine/utils/jsonSchemaConverter.js";

const defaultJSON = `{
  "metadata": {
    "title": "Sample Form"
  },
  "ui": {
    "steps": [
      {
        "id": "step1",
        "title": "Personal Info"
      }
    ]
  },
  "sections": [
    {
      "id": "section1",
      "title": "Basic Information",
      "step": "step1",
      "fields": [
        {
          "id": "name",
          "name": "name",
          "type": "text",
          "label": "Full Name",
          "placeholder": "Enter your name",
          "width": "half",
          "validation": {
            "required": true
          }
        },
        {
          "id": "email",
          "name": "email",
          "type": "email",
          "label": "Email Address",
          "placeholder": "Enter your email",
          "width": "half",
          "validation": {
            "required": true
          }
        }
      ]
    }
  ]
}`;

// Available example schemas
const exampleSchemas = {
  simple: { name: "Simple Form", schema: simpleFormSchema },
  stepper: { name: "Multi-Step Form", schema: stepperFormSchema },
  conditional: {
    name: "Conditional Logic",
    schema: conditionalLogicFormSchema,
  },
  dynamic: { name: "Dynamic API Select", schema: apiDrivenFormSchema },
  fieldValidation: {
    name: "Field-Level Validation",
    schema: fieldLevelValidationSchema,
  },
  repeatable: { name: "Repeatable Sections", schema: repeatableSectionSchema },
  businessRegistration: {
    name: "Business Registration (6 Steps)",
    schema: businessRegistrationSchema,
  },
  businessStarterPackage: {
    name: "Business Starter Package",
    schema: businessStarterPackageSchema,
  },
  fieldsOnly: { name: "Fields Only Structure", schema: simpleFieldsOnlySchema },
  sectionsOnly: {
    name: "Sections Only Structure",
    schema: simpleSectionsOnlySchema,
  },
  stepperFields: { name: "Stepper + Fields", schema: stepperWithFieldsSchema },
  stepperSections: {
    name: "Stepper + Sections",
    schema: stepperWithSectionsSchema,
  },
  mixed: { name: "Mixed Structure", schema: mixedStepperSchema },
} as const;

type ExampleSchemaKey = keyof typeof exampleSchemas;

export function JSONSchemaEditor() {
  const [jsonInput, setJsonInput] = useState(defaultJSON);
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [error, setError] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedExample, setSelectedExample] = useState<ExampleSchemaKey | "">(
    ""
  );

  const handlePreview = () => {
    setError("");

    try {
      const parsed = JSON.parse(jsonInput);

      // Check if it's already a FormSchema (has sections, steps, or fields at root)
      if (parsed.sections || parsed.steps || parsed.fields) {
        // It's already a FormSchema, use it directly
        setFormSchema(parsed as FormSchema);
        setShowPreview(true);
        return;
      }

      // Otherwise, validate and convert from JSON schema format
      const validation = validateJSONSchema(jsonInput);
      if (!validation.valid) {
        setError(validation.error || "Invalid JSON");
        setShowPreview(false);
        return;
      }

      // Convert to FormSchema
      const schema = convertJSONToFormSchema(parsed);
      setFormSchema(schema);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
      setShowPreview(false);
    }
  };
  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log("Form Data:", data);
    alert("Form submitted! Check console for data.");
  };

  const handleLoadSample = () => {
    setJsonInput(defaultJSON);
    setError("");
    setShowPreview(false);
    setSelectedExample("");
  };

  const handleLoadExampleSchema = (key: ExampleSchemaKey) => {
    const example = exampleSchemas[key];

    // Remove validationSchema as it contains Zod schema which can't be serialized
    const { validationSchema, ...schemaWithoutValidation } = example.schema;

    setJsonInput(JSON.stringify(schemaWithoutValidation, null, 2));
    setSelectedExample(key);
    setError("");
    setShowPreview(false);
  };

  const handleClear = () => {
    setJsonInput("");
    setError("");
    setShowPreview(false);
    setFormSchema(null);
    setSelectedExample("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          JSON Schema Editor
        </h2>
        <p className="text-gray-600">
          Paste your JSON schema and preview the generated form
        </p>
      </div>

      {/* Load Example Schema Dropdown */}
      <div className="form-container p-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            📚 Load Example Schema:
          </label>
          <select
            value={selectedExample}
            onChange={(e) =>
              handleLoadExampleSchema(e.target.value as ExampleSchemaKey)
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
          >
            <option value="">-- Select an example schema --</option>
            <optgroup label="📋 Main Examples">
              <option value="simple">{exampleSchemas.simple.name}</option>
              <option value="stepper">{exampleSchemas.stepper.name}</option>
              <option value="conditional">
                {exampleSchemas.conditional.name}
              </option>
              <option value="dynamic">{exampleSchemas.dynamic.name}</option>
              <option value="fieldValidation">
                {exampleSchemas.fieldValidation.name}
              </option>
              <option value="repeatable">
                {exampleSchemas.repeatable.name}
              </option>
            </optgroup>
            <optgroup label="🏢 Real-World Examples">
              <option value="businessRegistration">
                {exampleSchemas.businessRegistration.name}
              </option>
              <option value="businessStarterPackage">
                {exampleSchemas.businessStarterPackage.name}
              </option>
            </optgroup>
            <optgroup label="🏗️ Structure Variations">
              <option value="fieldsOnly">
                {exampleSchemas.fieldsOnly.name}
              </option>
              <option value="sectionsOnly">
                {exampleSchemas.sectionsOnly.name}
              </option>
              <option value="stepperFields">
                {exampleSchemas.stepperFields.name}
              </option>
              <option value="stepperSections">
                {exampleSchemas.stepperSections.name}
              </option>
              <option value="mixed">{exampleSchemas.mixed.name}</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Editor Section */}
      <div className="form-container p-6">
        <div className="mb-4 flex justify-between items-center">
          <label className="block text-sm font-semibold text-gray-700">
            JSON Schema Input:
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleLoadSample}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded transition-colors"
            >
              Load Sample
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-white hover:bg-gray-600 border border-gray-600 rounded transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handlePreview}
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded shadow-lg transition-all"
            >
              🔍 Preview Form
            </button>
          </div>
        </div>
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <Editor
            height="400px"
            defaultLanguage="json"
            value={jsonInput}
            onChange={(value) => setJsonInput(value || "")}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              wrappingIndent: "indent",
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true,
              tabSize: 2,
              insertSpaces: true,
            }}
          />
        </div>
        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-red-600 text-xl">⚠️</span>
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-1">
                  Validation Error
                </h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        {/* Success Message */}
        {showPreview && !error && (
          <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✅</span>
              <div>
                <h4 className="text-sm font-semibold text-green-800 mb-1">
                  Schema Valid!
                </h4>
                <p className="text-sm text-green-700">
                  Form preview is shown below. Scroll down to see your form.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* JSON Format Guide */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-blue-600">
            📖 JSON Schema Format Guide
          </summary>
          <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 space-y-2">
            <p>
              <strong>Required Structure:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <code>sections</code> - Array of form sections (required)
              </li>
              <li>
                <code>ui.steps</code> - Array of steps for multi-step forms
                (optional)
              </li>
              <li>
                <code>metadata</code> - Form metadata like title (optional)
              </li>
            </ul>
            <p className="mt-3">
              <strong>Field Types Supported:</strong>
            </p>
            <p className="ml-4">
              text, email, tel, number, date, select, radio, checkbox, file,
              autocomplete
            </p>
            <p className="mt-3">
              <strong>Repeatable Sections:</strong>
            </p>
            <p className="ml-4">
              Set <code>repeatable: true</code> and add <code>listConfig</code>
            </p>
          </div>
        </details>
      </div>

      {/* Preview Section */}
      {showPreview && formSchema && (
        <div className="space-y-4">
          <div className="border-t-4 border-blue-500 pt-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              📋 Form Preview
            </h3>
          </div>

          <div className="form-container">
            <FormEngine
              schema={formSchema}
              onSubmit={handleSubmit}
              submitButtonText="Submit Form"
            />
          </div>
        </div>
      )}
    </div>
  );
}
