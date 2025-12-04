# Form Engine

A powerful, flexible, and beautiful form builder for React applications built with React Hook Form, Zod, and Tailwind CSS.

## Features

✨ **Reusable Field Components**

- Text, Number, Date inputs (with React Day Picker calendar)
- Numeric String Field (string type but only accepts digits - for IDs, postal codes, etc.)
- Custom Select with single/multi-select support (with search)
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
npm install react-hook-form @hookform/resolvers zod react-day-picker lucide-react
npm install -D tailwindcss postcss autoprefixer
```

### Key Dependencies

- **react-hook-form** - Form state management and validation
- **zod** - Schema validation
- **react-day-picker** - Beautiful date picker with calendar UI
- **lucide-react** - Icon library
- **tailwindcss** - Styling

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

### Date Field with Calendar Picker

```typescript
{
  name: 'dateOfBirth',
  label: 'Date of Birth',
  type: 'date',
  placeholder: 'Select a date',
  cols: 6,
  min: '1900-01-01', // Minimum selectable date
  max: '2024-12-31', // Maximum selectable date
  validation: {
    required: 'Date of birth is required',
  },
}
```

The date field uses **React Day Picker** for a beautiful calendar interface with:

- Visual calendar popup for date selection
- Min/max date restrictions
- Disabled dates support
- Formatted date display (e.g., "Dec 4, 2025")
- Click-outside to close functionality

### Multi-Select Field

```typescript
{
  name: 'skills',
  label: 'Skills',
  type: 'select',
  placeholder: 'Select your skills',
  cols: 6,
  isMulti: true, // Enable multiple selection
  options: [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'React', value: 'react' },
    { label: 'Node.js', value: 'node' },
  ],
  validation: {
    required: 'Please select at least one skill',
  },
}
```

Features:

- Multiple value selection with checkboxes
- Selected items displayed as tags with remove buttons
- Search functionality (for 5+ options)
- Keyboard navigation support
- Works with both static and dynamic options

### Dynamic Select

```typescript
{
  name: 'user',
  label: 'Select User',
  type: 'select',
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
    {
      name: "quantity",
      type: "number",
      label: "Quantity",
      validation: {
        required: true,
        min: 1, // Simple min validation (default message)
        max: 9999, // Simple max validation (default message)
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

### NumberField Min/Max Validation

The `NumberField` component supports min/max validation through the `validation` prop:

```typescript
{
  name: "shares",
  type: "number",
  label: "Number of Shares",
  validation: {
    required: true,
    min: { value: 1, message: "Minimum 1 share required" },
    max: { value: 99999999, message: "Maximum 99,999,999 shares allowed" },
  },
}

// Or use simple numbers for default messages
{
  name: "age",
  type: "number",
  label: "Age",
  validation: {
    min: 18, // "Minimum value is 18"
    max: 120, // "Maximum value is 120"
  },
}
```

**Note:** Use `validation.min` and `validation.max` for number validation. The `min`/`max` props directly on the field config are not used for validation.

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
