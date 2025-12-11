# React Hook Form Engine

A powerful, flexible, and beautiful form builder for React applications built with **React Hook Form**, **Zod**, and **Tailwind CSS**. Create complex forms with minimal code!

[![npm version](https://img.shields.io/npm/v/react-hook-form-engine.svg)](https://www.npmjs.com/package/react-hook-form-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

### 📋 Rich Field Components

- **Text Inputs**: Text, Textarea, Number, Password
- **Date Picker**: Beautiful calendar UI with React Day Picker
- **Phone Input**: International phone numbers with country selection
- **Select**: Single/Multi-select with search functionality
- **File Upload**: Single/multiple files with API upload support
- **Radio & Checkbox**: Radio groups and checkboxes
- **Profile Picture**: Avatar upload with preview
- All fields support comprehensive validation

### 🎨 Beautiful UI & Layout

- Built with **Tailwind CSS**
- Responsive **12-column grid** layout system
- Clean and modern design
- Mobile-first approach
- Customizable styling for all components
- Professional form sections and steps

### ✅ Flexible Validation

- **Zod Schema** - Centralized type-safe validation
- **Field-level validation** - Individual field rules
- **Combine both** approaches seamlessly
- Support for all field types
- Custom validation functions
- Real-time validation feedback

### 🔄 Conditional Logic

- **Show/hide** fields based on other values
- **Enable/disable** fields dynamically
- **Clear dependent** fields automatically
- Complex conditions: `equals`, `notEquals`, `in`, `notIn`, `isEmpty`, `isNotEmpty`, `greaterThan`, `lessThan`
- Live reactive updates with React Hook Form's `watch()`
- Works on fields, sections, and steps

### 🔁 Repeatable Sections (Field Arrays)

- Add/remove groups of fields dynamically
- Perfect for work experience, education, skills lists
- Configurable min/max items
- Default values support
- Initial items configuration
- Custom styling and button text

### 📊 Multi-Step Forms (Wizard)

- Easy stepper/wizard forms with progress indicator
- Conditional steps based on form values
- Per-step validation
- Beautiful step navigation UI
- Support for both sections and direct fields in steps

### 🌐 Dynamic Options

- Load select options from API
- Transform data on the fly
- Custom fetch functions
- Perfect for cascading selects (division → district → sub-district)

### 🔌 API Data Sources (NEW in v1.7.0)

- **Fetch data from APIs** and display in read-only fields
- **Multiple API endpoints** support
- Works on **field, section, and step** levels
- **Loading states** and **error handling**
- **Transform responses** before display
- **Nested data paths** (e.g., `user.profile.name`)
- GET and POST methods support

### 🏗️ Flexible Structure

- Simple forms with direct fields
- Forms with sections
- Multi-step forms with sections
- Multi-step forms with direct fields
- Mix sections and direct fields anywhere
- Nested field groups for complex data structures

### 🛠️ Developer Experience

- Full **TypeScript** support
- Clean architecture with FormProvider/useFormContext
- Modular and extensible
- Comprehensive documentation
- Multiple examples included
- Easy to customize and extend

## 📦 Installation

```bash
npm install react-hook-form-engine
```

### Peer Dependencies

```bash
npm install react-hook-form @hookform/resolvers zod
```

### Optional (for enhanced features)

```bash
npm install react-day-picker date-fns  # For date picker
npm install lucide-react               # For icons
```

## 🎯 Quick Start

### 1. Import and Setup

```typescript
import { FormEngine } from "react-hook-form-engine";
import "react-hook-form-engine/styles.css";
import type { FormSchema } from "react-hook-form-engine";

const schema: FormSchema = {
  fields: [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      validation: {
        required: "Name is required",
        minLength: { value: 2, message: "Name too short" },
      },
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      validation: {
        required: true,
        email: "Please enter a valid email",
      },
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

### 2. That's it! 🎉

You now have a fully functional form with validation!

## 📚 Documentation

### Complete Guides

- **[API Data Guide](./API_DATA_GUIDE.md)** - Fetch and display API data in forms
- **[Field Validation Guide](./FIELD_VALIDATION_GUIDE.md)** - Comprehensive validation examples
- **[Repeatable Sections Guide](./REPEATABLE_SECTIONS_GUIDE.md)** - Dynamic field arrays
- **[Form Structure Guide](./FORM_STRUCTURE_GUIDE.md)** - Different form layouts
- **[Nested Field Groups Guide](./NESTED_FIELD_GROUPS_GUIDE.md)** - Complex data structures
- **[Usage Guide](./USAGE_GUIDE.md)** - General usage patterns

## 💡 Examples

### Multi-Step Form with Validation

```typescript
const formSchema: FormSchema = {
  steps: [
    {
      title: "Personal Information",
      description: "Tell us about yourself",
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          cols: 1,
          validation: { required: true },
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          cols: 1,
          validation: { required: true },
        },
        {
          name: "email",
          label: "Email",
          type: "text",
          cols: 2,
          validation: { required: true, email: true },
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "phone",
          cols: 2,
          defaultCountry: "bd",
        },
      ],
    },
    {
      title: "Additional Details",
      fields: [
        {
          name: "dateOfBirth",
          label: "Date of Birth",
          type: "date",
          cols: 1,
        },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          cols: 1,
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ],
        },
      ],
    },
  ],
};
```

### Conditional Fields

```typescript
const schema: FormSchema = {
  fields: [
    {
      name: "hasExperience",
      label: "Do you have work experience?",
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
      showWhen: {
        field: "hasExperience",
        equals: true,
      },
      validation: {
        required: "Please specify years of experience",
        min: { value: 1, message: "Must be at least 1 year" },
      },
    },
  ],
};
```

### Repeatable Sections (Work Experience)

```typescript
const schema: FormSchema = {
  sections: [
    {
      title: "Work Experience",
      description: "Add your work history",
      repeatable: true,
      repeatableConfig: {
        addButtonText: "+ Add Experience",
        removeButtonText: "Remove",
        minItems: 1,
        maxItems: 10,
        initialItems: 1,
      },
      fields: [
        {
          name: "company",
          label: "Company Name",
          type: "text",
          cols: 1,
          validation: { required: true },
        },
        {
          name: "position",
          label: "Position",
          type: "text",
          cols: 1,
          validation: { required: true },
        },
        {
          name: "startDate",
          label: "Start Date",
          type: "date",
          cols: 1,
        },
        {
          name: "endDate",
          label: "End Date",
          type: "date",
          cols: 1,
        },
      ],
    },
  ],
};
```

### API Data Sources (Read-Only Fields)

```typescript
const schema: FormSchema = {
  dataSources: [
    {
      id: "userProfile",
      url: "/api/user/profile",
      method: "GET",
      transform: (data) => ({
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.emailAddress,
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
      name: "userEmail",
      label: "Email",
      type: "text",
      readOnly: true,
      dataSourceId: "userProfile",
      dataPath: "email",
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      placeholder: "Add your notes...",
    },
  ],
};
```

### Dynamic Select (Cascading Dropdowns)

```typescript
const schema: FormSchema = {
  fields: [
    {
      name: "division",
      label: "Division",
      type: "select",
      cols: 1,
      dynamicOptions: {
        url: "/api/divisions",
        transform: (data) =>
          data.map((d) => ({
            label: d.name,
            value: d.id,
          })),
      },
    },
    {
      name: "district",
      label: "District",
      type: "select",
      cols: 1,
      dynamicOptions: {
        url: "/api/districts",
        transform: (data) =>
          data.map((d) => ({
            label: d.name,
            value: d.id,
          })),
      },
      showWhen: {
        field: "division",
        isNotEmpty: true,
      },
    },
  ],
};
```

### File Upload with API

```typescript
const schema: FormSchema = {
  fields: [
    {
      name: "resume",
      label: "Upload Resume",
      type: "file",
      accept: ".pdf,.doc,.docx",
      validation: { required: "Resume is required" },
    },
    {
      name: "profilePicture",
      label: "Profile Picture",
      type: "profilePicture",
      accept: "image/*",
      maxSize: 5 * 1024 * 1024, // 5MB
      uploadConfig: {
        url: "/api/upload",
        fieldName: "file",
        transform: (response) => response.fileUrl,
      },
    },
  ],
};
```

## 🎨 Customization

### Custom Styling

```typescript
<FormEngine
  schema={schema}
  onSubmit={handleSubmit}
  className="max-w-4xl mx-auto p-6"
  stepperClassName="bg-blue-50"
  submitButtonClassName="bg-green-600 hover:bg-green-700"
  submitButtonText="Save Form"
/>
```

### Field-Level Styling

```typescript
{
  name: 'email',
  label: 'Email Address',
  type: 'text',
  className: 'my-custom-field',
  labelClassName: 'text-blue-600 font-bold',
  inputClassName: 'border-2 border-blue-300',
  errorClassName: 'text-red-600'
}
```

## 📋 Field Types

| Field Type       | Description            | Key Features                                 |
| ---------------- | ---------------------- | -------------------------------------------- |
| `text`           | Single-line text input | Validation, placeholder, min/max length      |
| `textarea`       | Multi-line text input  | Rows configuration, character limits         |
| `number`         | Numeric input          | Min/max values, step                         |
| `date`           | Date picker            | Calendar UI, min/max dates                   |
| `select`         | Dropdown select        | Single/multi-select, search, dynamic options |
| `file`           | File upload            | Multiple files, accept types, API upload     |
| `radio`          | Radio buttons          | Multiple options, conditional logic          |
| `checkbox`       | Checkbox               | Boolean values, custom labels                |
| `phone`          | Phone number           | Country selection, formatting                |
| `password`       | Password input         | Show/hide toggle                             |
| `profilePicture` | Avatar upload          | Preview, crop, API upload                    |

## 🔧 Advanced Features

### Nested Field Groups

Create complex nested data structures:

```typescript
{
  sections: [
    {
      title: 'Business Information',
      fieldGroup: 'businessInfo', // Creates nested structure
      fields: [
        { name: 'name', label: 'Business Name', type: 'text' },
        { name: 'registration', label: 'Registration No', type: 'text' }
      ]
    }
  ]
}

// Output data:
{
  businessInfo: {
    name: 'ABC Corp',
    registration: '123456'
  }
}
```

### Validation Options

```typescript
validation: {
  required: 'This field is required',
  minLength: { value: 2, message: 'Too short' },
  maxLength: { value: 100, message: 'Too long' },
  min: { value: 18, message: 'Must be 18+' },
  max: { value: 120, message: 'Invalid age' },
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email'
  },
  email: 'Invalid email address',
  custom: (value) => value !== 'admin' || 'Username not allowed'
}
```

### Conditional Operators

- `equals` - Field equals value
- `notEquals` - Field not equals value
- `in` - Field value in array
- `notIn` - Field value not in array
- `isEmpty` - Field is empty
- `isNotEmpty` - Field has value
- `greaterThan` - Greater than (numeric)
- `lessThan` - Less than (numeric)

## 📦 What's New

### v1.7.0 (Latest)

- ✨ **API Data Sources** - Fetch and display API data in read-only fields
- 🔌 Multiple API endpoint support
- 🔄 Loading states and error handling
- 🎯 Nested data path support
- 📝 Response transformation
- 🌐 Works on field, section, and step levels

### v1.6.0

- 🔁 **Repeatable Sections** - Dynamic field arrays
- ➕ Add/remove groups of fields
- ⚙️ Configurable min/max items
- 🎨 Custom styling options

### v1.5.0

- ✅ **Field-Level Validation** - No Zod required
- 🎯 Per-field validation rules
- 🔧 Mix with Zod schemas
- 📝 Better error messages

## 🏃 Running Examples

```bash
# Clone the repository
git clone https://github.com/amiruleeeiu/form-engine.git
cd form-engine

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit the demo to see all examples in action!

## 📖 API Reference

### FormEngine Props

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

### FormSchema Structure

```typescript
interface FormSchema {
  dataSources?: DataSource[]; // API data sources
  steps?: FormStep[]; // Multi-step form
  sections?: FormSection[]; // Form sections
  fields?: FieldConfig[]; // Direct fields
  validationSchema?: ZodSchema; // Zod validation
  defaultValues?: Record<string, any>;
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT © [amiruleeeiu](https://github.com/amiruleeeiu)

## 🔗 Links

- [GitHub Repository](https://github.com/amiruleeeiu/form-engine)
- [npm Package](https://www.npmjs.com/package/react-hook-form-engine)
- [Report Issues](https://github.com/amiruleeeiu/form-engine/issues)

## ⭐ Show Your Support

If this project helped you, please give it a ⭐️!

---

**Made with ❤️ by [amiruleeeiu](https://github.com/amiruleeeiu)**

## 🎓 Examples in Repository

The repository includes comprehensive examples:

- **`simpleFormSchema.ts`** - Basic form with validation
- **`stepperFormSchema.ts`** - Multi-step wizard form
- **`conditionalLogicSchema.ts`** - Conditional fields demo
- **`dynamicSelectSchema.ts`** - Cascading dropdowns
- **`repeatableSectionSchema.ts`** - Work experience, education
- **`apiDataFormSchema.ts`** - API data sources (NEW!)
- **`businessRegistrationSchema.ts`** - Complete business form
- **`userProfileSchema.ts`** - User profile with all field types
- **`fieldLevelValidationSchema.ts`** - Validation examples
- **`flexibleFormSchema.ts`** - Mixed structure demo

## 💻 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🧪 Testing

```bash
npm run test        # Run tests
npm run test:watch  # Watch mode
```

## 🏗️ Build for Production

```bash
npm run build      # Build library
npm run preview    # Preview build
```

## 📊 Bundle Size

The library is optimized for production with tree-shaking support. Only import what you need!

## 🌟 Testimonials

> "This form engine saved me weeks of development time!" - Developer

> "The most flexible form library I've used in React" - Engineer

## 🎯 Use Cases

- **User Registration Forms** - Multi-step registration with validation
- **Business Applications** - Complex business forms with nested data
- **Survey Forms** - Dynamic surveys with conditional questions
- **Job Applications** - Work experience, education, skills
- **E-commerce Checkout** - Shipping, billing, payment forms
- **Admin Panels** - CRUD forms with API integration
- **Profile Management** - User profiles with all field types

## ❓ FAQ

**Q: Can I use without Zod?**
A: Yes! Field-level validation works without Zod.

**Q: Does it support React 18?**
A: Yes, fully compatible with React 18+.

**Q: Can I customize the styling?**
A: Absolutely! All components support custom classes.

**Q: Is TypeScript required?**
A: No, but highly recommended for better DX.

**Q: How do I handle file uploads?**
A: Use the `file` or `profilePicture` field types with optional API upload config.

**Q: Can I fetch data from APIs?**
A: Yes! Use `dataSources` for read-only fields or `dynamicOptions` for select fields.

## 🐛 Known Issues

None at the moment! Report issues on [GitHub](https://github.com/amiruleeeiu/form-engine/issues).

## 🗺️ Roadmap

- [ ] Drag-and-drop file upload
- [ ] Rich text editor field
- [ ] Date range picker
- [ ] Time picker
- [ ] Color picker
- [ ] Signature field
- [ ] Form builder UI
- [ ] Export/import form schemas
- [ ] Form analytics

## 💬 Get Help

- 📧 Email: [your-email@example.com]
- 💬 Discussions: [GitHub Discussions](https://github.com/amiruleeeiu/form-engine/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/amiruleeeiu/form-engine/issues)

---

**Happy Form Building! 🚀**
└── examples/
├── simpleFormSchema.ts
├── stepperFormSchema.ts
├── conditionalLogicSchema.ts
└── dynamicSelectSchema.ts

````

## Installation

```bash
npm install
````

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

## Complete Example with All Features

```typescript
import { FormSchema } from "./form-engine/types";

export const completeFormSchema: FormSchema = {
  sections: [
    {
      title: "Personal Information",
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          cols: 6,
          validation: {
            required: true,
            minLength: { value: 2, message: "Minimum 2 characters" },
          },
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          cols: 6,
          validation: {
            required: true,
            minLength: 2,
          },
        },
        {
          name: "email",
          label: "Email",
          type: "text",
          cols: 12,
          validation: {
            required: "Email is required",
            email: true,
          },
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          cols: 6,
          validation: {
            required: true,
            min: { value: 18, message: "Must be 18+" },
            max: { value: 120, message: "Invalid age" },
          },
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "phone",
          cols: 6,
          validation: {
            required: true,
          },
          defaultCountry: "bd",
        },
        {
          name: "dateOfBirth",
          label: "Date of Birth",
          type: "date",
          cols: 12,
          validation: {
            required: true,
          },
        },
      ],
    },
    {
      title: "Location Selection",
      description: "Select your location",
      fields: [
        {
          name: "division",
          label: "Division",
          type: "select",
          placeholder: "Select division",
          cols: 4,
          validation: {
            required: "Division is required",
          },
          dynamicOptions: {
            url: "http://localhost:3000/division",
            transform: (data: any[]) =>
              data.map((item) => ({
                label: item.fullName,
                value: item.id,
              })),
          },
        },
        {
          name: "district",
          label: "District",
          type: "select",
          placeholder: "Select district",
          cols: 4,
          validation: {
            required: "District is required",
          },
          dynamicOptions: {
            url: "http://localhost:3000/district",
            transform: (data: any[]) =>
              data.map((item) => ({
                label: item.fullName,
                value: item.id,
              })),
          },
          showWhen: {
            field: "division",
            isNotEmpty: true,
          },
        },
        {
          name: "subDistrict",
          label: "Sub-District",
          type: "select",
          placeholder: "Select sub-district",
          cols: 4,
          validation: {
            required: "Sub-District is required",
          },
          dynamicOptions: {
            url: "http://localhost:3000/sub-district",
            transform: (data: any[]) =>
              data.map((item) => ({
                label: item.fullName,
                value: item.id,
              })),
          },
          showWhen: {
            field: "district",
            isNotEmpty: true,
          },
        },
      ],
    },
  ],
};
```

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

## Repeatable Sections (Form Arrays)

Repeatable sections allow users to dynamically add and remove groups of fields:

```typescript
{
  title: "Work Experience",
  description: "Add your work experience (you can add multiple)",
  repeatable: true,
  repeatableConfig: {
    addButtonText: "Add Experience",
    removeButtonText: "Remove",
    minItems: 1,        // Minimum items required
    maxItems: 10,       // Maximum items allowed
    initialItems: 1,    // Items to show on form load
    defaultItem: {      // Default values for new items
      companyName: "",
      position: ""
    }
  },
  fields: [
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
      cols: 6,
      validation: { required: true }
    },
    {
      name: "position",
      label: "Position",
      type: "text",
      cols: 6,
      validation: { required: true }
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date",
      cols: 6
    },
    {
      name: "endDate",
      label: "End Date",
      type: "date",
      cols: 6
    }
  ]
}
```

**Form data structure:**

```typescript
{
  workExperience: [
    {
      companyName: "ABC Corp",
      position: "Developer",
      startDate: "2020-01-01",
      endDate: "2022-12-31",
    },
    {
      companyName: "XYZ Ltd",
      position: "Senior Developer",
      startDate: "2023-01-01",
      endDate: null,
    },
  ];
}
```

**See [REPEATABLE_SECTIONS_GUIDE.md](./REPEATABLE_SECTIONS_GUIDE.md) for detailed examples.**

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

## Installation & Usage

### Install from npm

```bash
npm install @amiruleeeiu/react-form-engine
```

### Import in your project

```typescript
import { FormEngine } from "@amiruleeeiu/react-form-engine";
import "@amiruleeeiu/react-form-engine/styles.css";
import type { FormSchema } from "@amiruleeeiu/react-form-engine";

// Your form schema
const myFormSchema: FormSchema = {
  sections: [
    {
      title: "Personal Info",
      fields: [
        {
          name: "name",
          label: "Full Name",
          type: "text",
          validation: {
            required: true,
            minLength: { value: 2, message: "Name too short" },
          },
        },
      ],
    },
  ],
};

// Use in component
function MyForm() {
  const handleSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  return <FormEngine schema={myFormSchema} onSubmit={handleSubmit} />;
}
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

## What's New in v1.5.0

🔁 **Repeatable Sections** - Add/remove groups of fields dynamically!

```typescript
{
  title: "Work Experience",
  repeatable: true,
  repeatableConfig: {
    addButtonText: "Add Experience",
    removeButtonText: "Remove",
    minItems: 1,
    maxItems: 10,
    initialItems: 1
  },
  fields: [...]
}
```

Perfect for:

- Multiple work experiences
- Education history
- Skills list
- Project details
- Any repeating data structure

✨ **Previous Updates (v1.4.0)**

- Field-Level Validation - No mandatory Zod schemas!
- All fields support validation
- Fixed FileField "uncontrolled to controlled" error
- Improved spacing
- Location selector examples

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
