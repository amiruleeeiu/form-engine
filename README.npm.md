# @amiruleeeiu/react-form-engine

A powerful, flexible, and beautiful form builder for React applications built with React Hook Form, Zod, Tailwind CSS, and React Select.

## Features

- ✨ **Reusable Field Components** - Text, Number, Date, Select, Autocomplete, File, Radio, Checkbox
- 🎨 **Beautiful UI** - Built with Tailwind CSS, responsive grid layout
- 🔄 **Conditional Logic** - Show/hide/enable/disable fields dynamically
- 📊 **Multi-Step Forms** - Easy stepper/wizard forms with progress indicator
- 🔁 **Repeatable Sections** - Dynamic field arrays for lists of data
- 🌐 **Dynamic Options** - Load select options from API
- ✅ **Dual Validation** - Field-level or Zod schema validation
- 🏗️ **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install @amiruleeeiu/react-form-engine
```

### Peer Dependencies

Make sure you have React 18+ installed:

```bash
npm install react react-dom
```

## Quick Start

```tsx
import { FormEngine, FormSchema } from "@amiruleeeiu/react-form-engine";

const schema: FormSchema = {
  fields: [
    { name: "firstName", type: "text", label: "First Name", cols: 1 },
    { name: "lastName", type: "text", label: "Last Name", cols: 1 },
    {
      name: "email",
      type: "text",
      label: "Email",
      cols: 2,
      validation: { required: true, email: true },
    },
  ],
};

function App() {
  const handleSubmit = (data: any) => {
    console.log("Form data:", data);
  };

  return (
    <FormEngine
      schema={schema}
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    />
  );
}
```

## Form Schema Structure

### Simple Form with Fields

```typescript
const schema: FormSchema = {
  fields: [
    { name: "firstName", type: "text", label: "First Name", cols: 1 },
    { name: "email", type: "text", label: "Email", cols: 2 },
  ],
};
```

### Form with Sections

```typescript
const schema: FormSchema = {
  sections: [
    {
      title: "Personal Information",
      fields: [
        { name: "firstName", type: "text", label: "First Name" },
        { name: "lastName", type: "text", label: "Last Name" },
      ],
    },
    {
      title: "Contact",
      fields: [{ name: "email", type: "text", label: "Email" }],
    },
  ],
};
```

### Multi-Step Form

```typescript
const schema: FormSchema = {
  steps: [
    {
      title: "Personal Info",
      sections: [
        {
          title: "Basic Details",
          fields: [{ name: "firstName", type: "text", label: "First Name" }],
        },
      ],
    },
    {
      title: "Contact",
      fields: [{ name: "email", type: "text", label: "Email" }],
    },
  ],
};
```

## Field Types

| Type           | Description                      |
| -------------- | -------------------------------- |
| `text`         | Text input                       |
| `number`       | Numeric input                    |
| `date`         | Date picker                      |
| `select`       | Dropdown select                  |
| `autocomplete` | Searchable select (React Select) |
| `radio`        | Radio button group               |
| `checkbox`     | Checkbox                         |
| `file`         | File upload                      |

## Validation

### Field-Level Validation

```typescript
{
  name: 'email',
  type: 'text',
  label: 'Email',
  validation: {
    required: true,                    // or custom message: "Email is required"
    email: true,                       // or custom message: "Invalid email"
    minLength: 5,                      // or { value: 5, message: 'Min 5 chars' }
    maxLength: 100,
    pattern: { value: /regex/, message: 'Invalid format' },
    custom: (value) => value.includes('@') || 'Must contain @',
  },
}
```

### Zod Schema Validation

```typescript
import { z } from 'zod';

const schema: FormSchema = {
  validationSchema: z.object({
    email: z.string().email('Invalid email'),
    age: z.number().min(18, 'Must be 18+'),
  }),
  fields: [...],
};
```

## Conditional Logic

### Show/Hide Fields

```typescript
{
  name: 'spouseName',
  type: 'text',
  label: "Spouse's Name",
  showWhen: { field: 'isMarried', equals: true },
}
```

### Enable/Disable Fields

```typescript
{
  name: 'bankAccount',
  type: 'text',
  label: 'Bank Account',
  enableWhen: { field: 'country', equals: 'BD' },
}
```

### Condition Operators

- `equals` / `notEquals` - Equality checks
- `in` / `notIn` - Array membership
- `isEmpty` / `isNotEmpty` - Empty checks
- `greaterThan` / `lessThan` - Numeric comparisons

## Repeatable Sections

```typescript
{
  title: 'Work Experience',
  repeatable: true,
  repeatableConfig: {
    addButtonText: 'Add Experience',
    removeButtonText: 'Remove',
    minItems: 1,
    maxItems: 5,
  },
  fields: [
    { name: 'company', type: 'text', label: 'Company' },
    { name: 'position', type: 'text', label: 'Position' },
  ],
}
```

## Dynamic Options

```typescript
{
  name: 'country',
  type: 'autocomplete',
  label: 'Country',
  dynamicOptions: {
    url: 'https://api.example.com/countries',
    transform: (data) => data.map(c => ({ label: c.name, value: c.code })),
  },
}
```

## Grid System

The `cols` property controls field width (based on 2-column grid):

- `cols: 1` - Half width (default)
- `cols: 2` - Full width

## FormEngine Props

| Prop                 | Type                  | Description                               |
| -------------------- | --------------------- | ----------------------------------------- |
| `schema`             | `FormSchema`          | Form configuration                        |
| `onSubmit`           | `(data: any) => void` | Submit handler                            |
| `submitButtonText`   | `string`              | Submit button label                       |
| `showStepNavigation` | `boolean`             | Show step navigation for multi-step forms |
| `className`          | `string`              | Custom class for form element             |

## Exports

```typescript
// Main component
import { FormEngine } from "@amiruleeeiu/react-form-engine";

// Types
import type {
  FormSchema,
  FormEngineProps,
  FieldConfig,
  FormSection,
  FormStep,
  Condition,
  FieldValidation,
} from "@amiruleeeiu/react-form-engine";

// Utilities
import {
  cn,
  evaluateCondition,
  extractDefaultValues,
  mergeDefaultValues,
  useDynamicOptions,
  getValidationRules,
  convertJSONToFormSchema,
  validateJSONSchema,
} from "@amiruleeeiu/react-form-engine";
```

## Styling

The component uses Tailwind CSS classes. Make sure Tailwind is configured in your project, or override styles using the className props.

## License

MIT

## Author

amiruleeeiu
