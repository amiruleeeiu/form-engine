# react-hook-form-engine

> A powerful, flexible, and beautiful form builder for React applications

[![npm version](https://img.shields.io/npm/v/react-hook-form-engine.svg)](https://www.npmjs.com/package/react-hook-form-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

Build complex forms with minimal code using **React Hook Form**, **Zod**, and **Tailwind CSS**.

## ✨ Features

- 📋 **12+ Field Types** - Text, Number, Date, Select, File, Phone, Password, Profile Picture, etc.
- 🎨 **Beautiful UI** - Pre-styled with Tailwind CSS, fully responsive
- ✅ **Flexible Validation** - Zod schema or field-level validation (or both!)
- 🔄 **Conditional Logic** - Show/hide/enable/disable fields based on values
- 🔁 **Repeatable Sections** - Dynamic field arrays (add/remove field groups)
- 📊 **Multi-Step Forms** - Wizard forms with progress indicator
- 🌐 **Dynamic Options** - Load select options from API
- 🔌 **API Data Sources** - Fetch and display API data in read-only fields (NEW!)
- 🏗️ **Flexible Structure** - Fields, sections, steps - use any combination
- 🛠️ **TypeScript** - Full type safety included

## 📦 Installation

```bash
npm install react-hook-form-engine
```

### Peer Dependencies

```bash
npm install react-hook-form @hookform/resolvers zod
```

### Import Styles

**Important:** Import the CSS in your entry file:

```tsx
import "react-hook-form-engine/styles.css";
```

No Tailwind configuration needed - styles are pre-compiled!

## 🚀 Quick Start

```tsx
import { FormEngine } from "react-hook-form-engine";
import "react-hook-form-engine/styles.css";
import type { FormSchema } from "react-hook-form-engine";

const schema: FormSchema = {
  fields: [
    {
      name: "fullName",
      type: "text",
      label: "Full Name",
      validation: {
        required: "Name is required",
        minLength: { value: 2, message: "Too short" },
      },
    },
    {
      name: "email",
      type: "text",
      label: "Email",
      cols: 2,
      validation: { required: true, email: true },
    },
  ],
};

function MyForm() {
  const handleSubmit = (data) => {
    console.log("Form data:", data);
  };

  return <FormEngine schema={schema} onSubmit={handleSubmit} />;
}
```

## 📋 Field Types

| Type             | Description     | Features                                     |
| ---------------- | --------------- | -------------------------------------------- |
| `text`           | Text input      | Validation, placeholder, min/max length      |
| `textarea`       | Multi-line text | Rows config, character limits                |
| `number`         | Numeric input   | Min/max values, step                         |
| `date`           | Date picker     | Calendar UI, min/max dates                   |
| `select`         | Dropdown        | Single/multi-select, search, dynamic options |
| `file`           | File upload     | Multiple files, accept types, API upload     |
| `radio`          | Radio buttons   | Multiple options, conditional logic          |
| `checkbox`       | Checkbox        | Boolean values, custom labels                |
| `phone`          | Phone input     | Country selection, formatting                |
| `password`       | Password input  | Show/hide toggle                             |
| `profilePicture` | Avatar upload   | Preview, API upload                          |

## 💡 Examples

### Multi-Step Form

```tsx
const schema: FormSchema = {
  steps: [
    {
      title: "Personal Info",
      fields: [
        { name: "firstName", type: "text", label: "First Name", cols: 1 },
        { name: "lastName", type: "text", label: "Last Name", cols: 1 },
      ],
    },
    {
      title: "Contact",
      fields: [
        { name: "email", type: "text", label: "Email", cols: 2 },
        { name: "phone", type: "phone", label: "Phone", cols: 2 },
      ],
    },
  ],
};
```

### Conditional Fields

```tsx
const schema: FormSchema = {
  fields: [
    {
      name: "hasExperience",
      label: "Do you have experience?",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    {
      name: "yearsOfExperience",
      label: "Years of Experience",
      type: "number",
      showWhen: { field: "hasExperience", equals: true },
      validation: { required: true, min: 1 },
    },
  ],
};
```

### Repeatable Sections

```tsx
const schema: FormSchema = {
  sections: [
    {
      title: "Work Experience",
      repeatable: true,
      repeatableConfig: {
        addButtonText: "+ Add Experience",
        minItems: 1,
        maxItems: 10,
      },
      fields: [
        { name: "company", type: "text", label: "Company", cols: 1 },
        { name: "position", type: "text", label: "Position", cols: 1 },
        { name: "startDate", type: "date", label: "Start Date", cols: 1 },
        { name: "endDate", type: "date", label: "End Date", cols: 1 },
      ],
    },
  ],
};
```

### API Data Sources (v1.7.0)

```tsx
const schema: FormSchema = {
  dataSources: [
    {
      id: "userProfile",
      url: "/api/user/profile",
      method: "GET",
      transform: (data) => ({
        fullName: `${data.firstName} ${data.lastName}`,
      }),
    },
  ],
  fields: [
    {
      name: "userName",
      label: "User Name",
      type: "text",
      readOnly: true,
      dataSourceId: "userProfile",
      dataPath: "fullName",
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      placeholder: "Add notes...",
    },
  ],
};
```

### Dynamic Select Options

```tsx
{
  name: 'country',
  type: 'select',
  label: 'Country',
  dynamicOptions: {
    url: '/api/countries',
    transform: (data) => data.map(c => ({
      label: c.name,
      value: c.code
    }))
  }
}
```

## ✅ Validation

### Field-Level Validation

```tsx
{
  name: 'email',
  type: 'text',
  label: 'Email',
  validation: {
    required: 'Email is required',
    email: 'Invalid email address',
    minLength: { value: 5, message: 'Too short' },
    maxLength: { value: 100, message: 'Too long' },
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid format'
    },
    custom: (value) => value !== 'admin' || 'Reserved word'
  }
}
```

### Zod Schema Validation

```tsx
import { z } from 'zod';

const schema: FormSchema = {
  validationSchema: z.object({
    email: z.string().email('Invalid email'),
    age: z.number().min(18, 'Must be 18+')
  }),
  fields: [...]
};
```

### Combine Both

```tsx
const validationSchema = z.object({
  name: z.string().min(2),
});

const schema: FormSchema = {
  validationSchema,
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      validation: {
        maxLength: { value: 50, message: "Too long" },
      },
    },
  ],
};
```

## 🔄 Conditional Logic

### Operators

- `equals` - Field equals value
- `notEquals` - Field not equals value
- `in` - Value in array
- `notIn` - Value not in array
- `isEmpty` - Field is empty
- `isNotEmpty` - Field has value
- `greaterThan` - Greater than (numeric)
- `lessThan` - Less than (numeric)

### Usage

```tsx
showWhen: { field: 'isMarried', equals: true }
hideWhen: { field: 'country', notEquals: 'BD' }
enableWhen: { field: 'age', greaterThan: 18 }
disableWhen: { field: 'email', isEmpty: true }
```

## 🎨 Grid Layout

Uses a 12-column grid (2 columns on desktop by default):

```tsx
cols: 1; // Half width (6 columns)
cols: 2; // Full width (12 columns)
cols: 6; // Half width (explicit)
cols: 12; // Full width (explicit)
```

Mobile is always full width.

## 🔧 FormEngine Props

```typescript
interface FormEngineProps {
  schema: FormSchema;
  onSubmit: (data: any) => void | Promise<void>;
  className?: string;
  stepperClassName?: string;
  contentClassName?: string;
  navigationClassName?: string;
  submitButtonClassName?: string;
  prevButtonClassName?: string;
  submitButtonText?: string;
  showStepNavigation?: boolean;
}
```

## 📦 TypeScript Types

```typescript
import type {
  FormSchema,
  FormEngineProps,
  FieldConfig,
  FormSection,
  FormStep,
  DataSource,
  Condition,
  FieldValidation,
  SelectOption,
  DynamicSelectConfig,
} from "react-hook-form-engine";
```

## 🎯 What's New

### v1.7.0

- ✨ **API Data Sources** - Fetch and display API data
- 🔌 Multiple endpoints support
- 🔄 Loading & error states
- 🎯 Nested data paths
- 📝 Response transformation

### v1.6.0

- 🔁 **Repeatable Sections** - Dynamic field arrays
- ➕ Add/remove field groups
- ⚙️ Min/max items config

### v1.5.0

- ✅ **Field-Level Validation** - No Zod required
- 🎯 Per-field rules
- 🔧 Mix with Zod

## 📖 Documentation

For detailed documentation, visit:

- [GitHub Repository](https://github.com/amiruleeeiu/form-engine)
- [Full Documentation](https://github.com/amiruleeeiu/form-engine#readme)

## 🤝 Contributing

Contributions welcome! See [Contributing Guide](https://github.com/amiruleeeiu/form-engine/blob/main/CONTRIBUTING.md)

## 📝 License

MIT © [amiruleeeiu](https://github.com/amiruleeeiu)

## 🔗 Links

- [GitHub](https://github.com/amiruleeeiu/form-engine)
- [npm](https://www.npmjs.com/package/react-hook-form-engine)
- [Issues](https://github.com/amiruleeeiu/form-engine/issues)

---

**Made with ❤️ for the React community**

## Author

amiruleeeiu
