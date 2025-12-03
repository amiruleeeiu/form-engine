# Usage Guide - @amiruleeeiu/react-form-engine

## Installation & Setup

### Step 1: Install the package

```bash
npm install @amiruleeeiu/react-form-engine
```

### Step 2: Import CSS in your main file

**This is REQUIRED for the form to display correctly!**

In your `main.tsx`, `App.tsx`, or root component file:

```tsx
// main.tsx or App.tsx
import "@amiruleeeiu/react-form-engine/styles.css";
```

### Step 3: Use the FormEngine component

```tsx
import { FormEngine, FormSchema } from "@amiruleeeiu/react-form-engine";

const schema: FormSchema = {
  fields: [
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      cols: 6,
      validation: { required: true },
    },
    {
      name: "email",
      type: "text",
      label: "Email",
      cols: 6,
      validation: { required: true, email: true },
    },
    {
      name: "country",
      type: "customSelect",
      label: "Country",
      cols: 12,
      options: [
        { label: "Bangladesh", value: "bd" },
        { label: "United States", value: "us" },
        { label: "United Kingdom", value: "uk" },
      ],
    },
  ],
};

function App() {
  const handleSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>My Form</h1>
      <FormEngine
        schema={schema}
        onSubmit={handleSubmit}
        submitButtonText="Submit"
      />
    </div>
  );
}

export default App;
```

## Important Notes

### CSS Import is Mandatory

The library comes with **pre-compiled Tailwind CSS** that includes all necessary styles for:
- Form fields
- Custom select dropdowns
- Buttons
- Layout
- Animations

If you forget to import the CSS, your form will not display correctly.

### No Tailwind Configuration Required

You **DO NOT** need to:
- Install Tailwind CSS in your project
- Configure `tailwind.config.js`
- Setup PostCSS

Everything is already compiled and bundled in the `styles.css` file!

### Using with Existing Tailwind Projects

If your project already uses Tailwind CSS, there might be some style conflicts. You can:

1. **Option 1:** Load the form engine styles first:
```tsx
import "@amiruleeeiu/react-form-engine/styles.css";
import "./your-app-styles.css";
```

2. **Option 2:** Use CSS modules or scoped styles to isolate conflicts

## Troubleshooting

### Form not displaying correctly?

**Problem:** Fields are not styled, layout is broken

**Solution:** Make sure you imported the CSS file:
```tsx
import "@amiruleeeiu/react-form-engine/styles.css";
```

### Select dropdown not working?

**Problem:** Custom select dropdown not showing options

**Solution:** The CSS includes all dropdown styles. Ensure CSS is imported.

### TypeScript errors?

**Problem:** Type errors when using FormSchema

**Solution:** Import types from the package:
```tsx
import type { FormSchema, FieldConfig } from "@amiruleeeiu/react-form-engine";
```

## Examples

### Simple Contact Form

```tsx
import "@amiruleeeiu/react-form-engine/styles.css";
import { FormEngine } from "@amiruleeeiu/react-form-engine";

const contactSchema = {
  fields: [
    { name: "name", type: "text", label: "Name", cols: 12 },
    { name: "email", type: "text", label: "Email", cols: 12 },
    { name: "message", type: "textarea", label: "Message", cols: 12 },
  ],
};

function ContactForm() {
  return (
    <FormEngine
      schema={contactSchema}
      onSubmit={(data) => console.log(data)}
      submitButtonText="Send Message"
    />
  );
}
```

For more examples and advanced usage, check out the [full documentation](https://github.com/amiruleeeiu/form-engine).
