# Nested Field Groups Guide

## Overview

The Form Engine now supports **nested field grouping** through the `fieldGroup` property on sections. This feature allows you to organize related fields under a parent object in the form data structure, making it easier to work with complex, hierarchical data.

## Why Use Field Groups?

### Without Field Groups (Flat Structure)

```javascript
{
  userType: "business",
  companyName: "ABC Corp",
  taxId: "123456"
}
```

### With Field Groups (Nested Structure)

```javascript
{
  userType: "business",
  businessInformation: {
    companyName: "ABC Corp",
    taxId: "123456"
  }
}
```

## Benefits

- ✅ Better data organization
- ✅ Logical grouping of related fields
- ✅ Easier to work with APIs that expect nested objects
- ✅ Cleaner TypeScript interfaces
- ✅ Matches your Zod schema structure

---

## Basic Usage

### 1. Add `fieldGroup` to Your Section

```typescript
{
  title: "Business Information",
  fieldGroup: "businessInformation", // ← Add this property
  fields: [
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
    },
    {
      name: "taxId",
      label: "Tax ID",
      type: "text",
    }
  ]
}
```

### 2. Update Your Zod Schema

```typescript
const schema = z.object({
  userType: z.string(),

  // Define nested object in Zod schema
  businessInformation: z
    .object({
      companyName: z.string(),
      taxId: z.string(),
    })
    .optional(),
});
```

### 3. Result

When the form is submitted, you'll get:

```javascript
{
  userType: "business",
  businessInformation: {
    companyName: "ABC Corporation",
    taxId: "12-3456789"
  }
}
```

---

## Complete Example

```typescript
import { z } from "zod";
import type { FormSchema } from "../form-engine/types";

// Define schema with nested structure
const registrationSchema = z.object({
  accountType: z.string(),

  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
  }),

  companyDetails: z
    .object({
      companyName: z.string().optional(),
      businessType: z.string().optional(),
      taxId: z.string().optional(),
    })
    .optional(),
});

export const registrationFormSchema: FormSchema = {
  validationSchema: registrationSchema,
  sections: [
    {
      title: "Account Type",
      fields: [
        {
          name: "accountType",
          label: "Account Type",
          type: "radio",
          options: [
            { label: "Personal", value: "personal" },
            { label: "Business", value: "business" },
          ],
        },
      ],
    },
    {
      title: "Personal Information",
      fieldGroup: "personalInfo", // ← Nested group
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          cols: 6,
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          cols: 6,
        },
        {
          name: "email",
          label: "Email",
          type: "text",
          cols: 12,
        },
      ],
    },
    {
      title: "Company Details",
      fieldGroup: "companyDetails", // ← Nested group
      showWhen: {
        field: "accountType",
        equals: "business",
      },
      fields: [
        {
          name: "companyName",
          label: "Company Name",
          type: "text",
        },
        {
          name: "businessType",
          label: "Business Type",
          type: "select",
          options: [
            { label: "LLC", value: "llc" },
            { label: "Corporation", value: "corp" },
          ],
        },
        {
          name: "taxId",
          label: "Tax ID",
          type: "text",
        },
      ],
    },
  ],
};
```

---

## Working with Conditional Logic

Field groups work seamlessly with conditional logic:

```typescript
{
  title: "Business Information",
  fieldGroup: "businessInformation",

  // Show section based on a field outside the group
  showWhen: {
    field: "userType",
    equals: "business",
  },

  fields: [
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
    },
    {
      name: "taxId",
      label: "Tax ID",
      type: "text",
      // You can still use field-level conditional logic
      showWhen: {
        field: "userType", // ← Reference flat field
        equals: "business",
      },
    },
  ],
}
```

**Important:** When using `showWhen`, `hideWhen`, `enableWhen`, or `disableWhen` inside a grouped section, always reference the **original field names** (not the nested paths).

---

## Default Values with Field Groups

### Setting Default Values

```typescript
export const formSchema: FormSchema = {
  defaultValues: {
    businessInformation: {
      companyName: "Default Company",
      taxId: "000-000-000",
    },
  },
  sections: [
    {
      fieldGroup: "businessInformation",
      fields: [
        { name: "companyName", type: "text", label: "Company Name" },
        { name: "taxId", type: "text", label: "Tax ID" },
      ],
    },
  ],
};
```

### Field-Level Defaults with Groups

```typescript
{
  fieldGroup: "businessInformation",
  fields: [
    {
      name: "companyName",
      type: "text",
      label: "Company Name",
      defaultValue: "ABC Corp", // ← Will be placed at businessInformation.companyName
    },
  ],
}
```

---

## Accessing Form Data

### In Your Submit Handler

```typescript
const handleSubmit = (data: any) => {
  console.log(data.businessInformation.companyName);
  console.log(data.businessInformation.taxId);

  // Or destructure
  const { businessInformation } = data;
  console.log(businessInformation);
};

<FormEngine schema={schema} onSubmit={handleSubmit} />;
```

### With TypeScript

```typescript
interface FormData {
  userType: string;
  businessInformation?: {
    companyName: string;
    taxId: string;
  };
}

const handleSubmit = (data: FormData) => {
  if (data.businessInformation) {
    const { companyName, taxId } = data.businessInformation;
    // Type-safe access
  }
};
```

---

## Multiple Levels of Nesting

Currently, the engine supports **one level of nesting**. For deeper nesting:

```typescript
// ✅ Supported
{
  fieldGroup: "businessInformation",
  fields: [...] // → businessInformation.field1, businessInformation.field2
}

// ❌ Not directly supported (but can be achieved with custom handling)
{
  fieldGroup: "company.details.primary",
  fields: [...]
}
```

For multiple levels, you can manually structure your data in the `onSubmit` handler or use the dot notation in field names.

---

## Best Practices

### ✅ Do:

- Use field groups for logically related fields (e.g., address, contact info, business details)
- Match your field groups to your Zod schema structure
- Use meaningful, camelCase names for `fieldGroup` values
- Keep field names simple within groups (they'll be nested automatically)

### ❌ Don't:

- Use field groups for unrelated fields just to create nesting
- Create deep nesting (stick to one level)
- Use special characters or spaces in `fieldGroup` names
- Reference nested paths in conditional logic (use original field names)

---

## Troubleshooting

### Fields Not Appearing

- Check that `fieldGroup` is spelled correctly
- Verify your Zod schema has the corresponding nested object

### Validation Errors

- Ensure your Zod schema structure matches your `fieldGroup` configuration
- Make sure nested objects in Zod are marked `.optional()` if they're conditionally shown

### Conditional Logic Not Working

- When referencing fields in `showWhen`/`hideWhen`, use the original field names, not the nested paths
- Example: Use `field: "userType"` not `field: "businessInformation.userType"`

---

## API Reference

### FormSection Interface

```typescript
interface FormSection {
  title?: string;
  description?: string;
  fields: FieldConfig[];

  // Nested field grouping
  fieldGroup?: string; // Parent key for grouping fields

  // Other properties...
  showWhen?: Condition;
  hideWhen?: Condition;
  repeatable?: boolean;
  // ...
}
```

### Example Values

```typescript
fieldGroup: "businessInformation";
fieldGroup: "personalInfo";
fieldGroup: "address";
fieldGroup: "contactDetails";
fieldGroup: "paymentInfo";
```

---

## See Also

- [Conditional Logic Guide](./FORM_STRUCTURE_GUIDE.md)
- [Field Validation Guide](./FIELD_VALIDATION_GUIDE.md)
- [Repeatable Sections Guide](./REPEATABLE_SECTIONS_GUIDE.md)
- [Examples](./src/examples/conditionalLogicSchema.ts)
