# Form Engine

A powerful, flexible, and beautiful form builder for React applications built with React Hook Form, Zod, Tailwind CSS, and React Select.

## Features

✨ **Reusable Field Components**

- Text, Number, Date inputs
- Select and Autocomplete (React Select)
- File Upload
- Radio groups and Checkboxes
- All with built-in validation support

🎨 **Beautiful UI**

- Built with Tailwind CSS
- Responsive grid layout system
- Clean and modern design

🔄 **Conditional Logic**

- Show/hide fields based on other field values
- Enable/disable fields dynamically
- Support for complex conditions (equals, notEquals, in, notIn, isEmpty, greaterThan, lessThan)
- Live reactive updates using React Hook Form's `watch()`

📊 **Multi-Step Forms**

- Easy stepper/wizard forms
- Progress indicator
- Conditional steps

🌐 **Dynamic Options**

- Load select options from API
- Transform data on the fly
- Custom fetch functions

🏗️ **Clean Architecture**

- Uses FormProvider and useFormContext
- Modular and extensible
- TypeScript support

## Folder Structure

```
src/
├── form-engine/
│   ├── components/
│   │   ├── fields/
│   │   │   ├── TextField.tsx
│   │   │   ├── NumberField.tsx
│   │   │   ├── DateField.tsx
│   │   │   ├── SelectField.tsx
│   │   │   ├── AutocompleteField.tsx
│   │   │   ├── FileField.tsx
│   │   │   ├── RadioField.tsx
│   │   │   ├── CheckboxField.tsx
│   │   │   └── index.ts
│   │   └── core/
│   │       ├── FieldRenderer.tsx
│   │       ├── FormSection.tsx
│   │       └── FormEngine.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── conditionalLogic.ts
│   │   └── dynamicOptions.ts
│   └── index.ts
└── examples/
    ├── simpleFormSchema.ts
    ├── stepperFormSchema.ts
    ├── conditionalLogicSchema.ts
    └── dynamicSelectSchema.ts
```

## Installation

```bash
npm install
```

## Dependencies

```bash
npm install react-hook-form @hookform/resolvers zod react-select
npm install -D tailwindcss postcss autoprefixer
```

## Usage

### Simple Form

```typescript
import { FormEngine } from "./form-engine";
import { simpleFormSchema } from "./examples/simpleFormSchema";

function App() {
  const handleSubmit = (data: any) => {
    console.log("Form data:", data);
  };

  return (
    <FormEngine
      schema={simpleFormSchema}
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    />
  );
}
```

### Multi-Step Form

```typescript
import { FormEngine } from "./form-engine";
import { stepperFormSchema } from "./examples/stepperFormSchema";

function App() {
  const handleSubmit = (data: any) => {
    console.log("Form data:", data);
  };

  return (
    <FormEngine
      schema={stepperFormSchema}
      onSubmit={handleSubmit}
      showStepNavigation={true}
    />
  );
}
```

## Form Structure Flexibility

The Form Engine supports multiple ways to structure your forms:

### 1. Simple Form with Direct Fields Only (No Sections)

```typescript
const schema: FormSchema = {
  fields: [
    { name: "firstName", type: "text", label: "First Name", cols: 6 },
    { name: "email", type: "text", label: "Email", cols: 6 },
  ],
};
```

### 2. Simple Form with Sections

```typescript
const schema: FormSchema = {
  sections: [
    {
      title: "Personal Info",
      fields: [
        { name: "firstName", type: "text", label: "First Name", cols: 6 },
      ],
    },
    {
      title: "Contact",
      fields: [{ name: "email", type: "text", label: "Email", cols: 12 }],
    },
  ],
};
```

### 3. Multi-Step Form with Sections Inside Steps

```typescript
const schema: FormSchema = {
  steps: [
    {
      title: 'Step 1',
      sections: [
        {
          title: 'Personal Details',
          fields: [...],
        },
      ],
    },
  ],
};
```

### 4. Multi-Step Form with Direct Fields (No Sections)

```typescript
const schema: FormSchema = {
  steps: [
    {
      title: "Step 1",
      fields: [{ name: "firstName", type: "text", label: "First Name" }],
    },
  ],
};
```

### 5. Mixed - Steps with Both Sections and Direct Fields

```typescript
const schema: FormSchema = {
  steps: [
    {
      title: 'Step 1',
      fields: [...], // Direct fields
    },
    {
      title: 'Step 2',
      sections: [...], // Organized in sections
    },
  ],
};
```

## Schema Examples

### Basic Field

```typescript
{
  name: 'firstName',
  label: 'First Name',
  type: 'text',
  placeholder: 'Enter your first name',
  cols: 1, // Column span: 1 (half row), 2 or 12 (full row). Default: 1
          // Mobile is always full width (1 field per row)
          // Desktop: cols=1 means 2 fields per row, cols=2 or 12 means 1 field per row
}
```

### Conditional Field (Show/Hide)

```typescript
{
  name: 'spouseName',
  label: "Spouse's Name",
  type: 'text',
  cols: 12,
  showWhen: {
    field: 'isMarried',
    equals: true,
  },
}
```

### Conditional Field (Enable/Disable)

```typescript
{
  name: 'bankAccount',
  label: 'Bank Account',
  type: 'text',
  cols: 6,
  enableWhen: {
    field: 'country',
    equals: 'BD',
  },
}
```

### Dynamic Select

```typescript
{
  name: 'user',
  label: 'Select User',
  type: 'autocomplete',
  cols: 12,
  dynamicOptions: {
    url: 'https://api.example.com/users',
    transform: (data: any[]) =>
      data.map(user => ({
        label: user.name,
        value: user.id,
      })),
  },
}
```

### Conditional Operators

- `equals`: Field value equals specified value
- `notEquals`: Field value does not equal specified value
- `in`: Field value is in array of values
- `notIn`: Field value is not in array of values
- `isEmpty`: Field is empty/null/undefined
- `isNotEmpty`: Field has a value
- `greaterThan`: Numeric field is greater than value
- `lessThan`: Numeric field is less than value

## Validation

The Form Engine supports **two validation approaches**:

### Option 1: Zod Schema (Centralized)

```typescript
import { z } from 'zod';

const validationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
});

const formSchema: FormSchema = {
  validationSchema,
  fields: [...],
};
```

### Option 2: Field-Level Validation (Per Field)

```typescript
const formSchema: FormSchema = {
  fields: [
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      validation: {
        required: true, // "This field is required"
        minLength: {
          value: 2,
          message: "First name must be at least 2 characters",
        },
      },
    },
    {
      name: "email",
      type: "text",
      label: "Email",
      validation: {
        required: "Email is required",
        email: "Please enter a valid email",
      },
    },
    {
      name: "age",
      type: "number",
      label: "Age",
      validation: {
        required: true,
        min: { value: 18, message: "Must be 18+" },
        max: { value: 120, message: "Invalid age" },
      },
    },
  ],
};
```

### Option 3: Combine Both

```typescript
const schema = z.object({
  name: z.string().min(2),
  age: z.number().optional(),
});

const formSchema: FormSchema = {
  validationSchema: schema, // Zod base validation
  fields: [
    {
      name: "age",
      type: "number",
      label: "Age",
      validation: {
        // Additional field-level rules
        min: { value: 18, message: "Must be 18+" },
      },
    },
  ],
};
```

**See [FIELD_VALIDATION_GUIDE.md](./FIELD_VALIDATION_GUIDE.md) for detailed examples.**

## Conditional Sections

```typescript
{
  title: 'Business Information',
  showWhen: {
    field: 'userType',
    equals: 'business',
  },
  fields: [...],
}
```

## Grid Layout

The form engine uses a 12-column grid system. You can specify how many columns each field should span:

```typescript
// Half width (6 columns)
{ name: 'firstName', cols: 6, ... }

// Full width (12 columns)
{ name: 'email', cols: 12, ... }

// One-third width (4 columns)
{ name: 'age', cols: 4, ... }
```

## Running the Demo

```bash
npm run dev
```

Then open your browser to see the demo with multiple form examples.

## Extending the Form Engine

### Adding a New Field Type

1. Create a new field component in `src/form-engine/components/fields/`
2. Add the field type to `FieldType` in `src/form-engine/types/index.ts`
3. Create a new interface extending `BaseFieldConfig`
4. Add the component to `FieldRenderer.tsx`
5. Export from `src/form-engine/components/fields/index.ts`

### Adding New Conditional Operators

Edit `src/form-engine/utils/conditionalLogic.ts` and add your operator to the `evaluateCondition` function.

## License

MIT
