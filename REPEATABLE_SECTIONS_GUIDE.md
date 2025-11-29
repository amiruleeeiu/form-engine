# Repeatable Sections Guide (Form Array)

## Overview / সংক্ষিপ্ত বিবরণ

Repeatable sections allow users to dynamically add and remove groups of fields. This is perfect for scenarios like:

- Adding multiple work experiences
- Adding multiple education entries
- Adding multiple skills
- Adding multiple project details

Repeatable sections ব্যবহার করে একই ধরনের তথ্য একাধিকবার যোগ করা যায়। যেমন:

- একাধিক চাকরির অভিজ্ঞতা যোগ করা
- একাধিক শিক্ষাগত যোগ্যতা যোগ করা
- একাধিক দক্ষতা যোগ করা
- একাধিক প্রজেক্ট যোগ করা

---

## Basic Structure / মূল গঠন

To make a section repeatable, add these two properties:

```typescript
{
  repeatable: true,  // Enable repeatable functionality
  repeatableConfig: {
    addButtonText: "Add Experience",
    removeButtonText: "Remove",
    minItems: 0,
    maxItems: 10
  }
}
```

---

## Complete Example / সম্পূর্ণ উদাহরণ

### Work Experience Example

```typescript
export const formSchema: FormSchema = {
  sections: [
    {
      title: "Work Experience",
      description: "Add your work experience (you can add multiple)",
      repeatable: true,
      repeatableConfig: {
        addButtonText: "Add Experience",
        removeButtonText: "Remove",
        minItems: 1, // At least 1 experience required
        maxItems: 10, // Maximum 10 experiences allowed
      },
      fields: [
        {
          name: "companyName",
          label: "Company Name",
          type: "text",
          placeholder: "Enter company name",
          cols: 1,
          validation: {
            required: "Company name is required",
          },
        },
        {
          name: "position",
          label: "Position",
          type: "text",
          placeholder: "Enter your position",
          cols: 1,
          validation: {
            required: "Position is required",
          },
        },
        {
          name: "startDate",
          label: "Start Date",
          type: "date",
          cols: 1,
          validation: {
            required: "Start date is required",
          },
        },
        {
          name: "endDate",
          label: "End Date",
          type: "date",
          cols: 1,
        },
        {
          name: "description",
          label: "Job Description",
          type: "text",
          placeholder: "Describe your responsibilities",
          cols: 2,
        },
      ],
    },
  ],
};
```

---

## Configuration Options / কনফিগারেশন অপশন

### `repeatableConfig` Properties

| Property           | Type                  | Description (English)            | বর্ণনা (বাংলা)                 |
| ------------------ | --------------------- | -------------------------------- | ------------------------------ |
| `addButtonText`    | `string`              | Text for the "Add" button        | "যোগ করুন" বাটনের টেক্সট       |
| `removeButtonText` | `string`              | Text for the "Remove" button     | "মুছে ফেলুন" বাটনের টেক্সট     |
| `minItems`         | `number`              | Minimum number of items required | সর্বনিম্ন কতটি আইটেম থাকতে হবে |
| `maxItems`         | `number`              | Maximum number of items allowed  | সর্বোচ্চ কতটি আইটেম থাকতে পারে |
| `defaultItem`      | `Record<string, any>` | Default values for new items     | নতুন আইটেমের ডিফল্ট ভ্যালু     |

### Example with All Options

```typescript
repeatableConfig: {
  addButtonText: "➕ Add Another Experience",
  removeButtonText: "✕ Delete This Experience",
  minItems: 1,
  maxItems: 5,
  defaultItem: {
    companyName: "",
    position: "",
    currentlyWorking: false
  }
}
```

---

## Multiple Repeatable Sections / একাধিক রিপিটেবল সেকশন

You can have multiple repeatable sections in the same form:

```typescript
export const formSchema: FormSchema = {
  sections: [
    // Basic Info (not repeatable)
    {
      title: "Personal Information",
      fields: [
        { name: "name", type: "text", label: "Full Name", cols: 1 },
        { name: "email", type: "text", label: "Email", cols: 1 },
      ],
    },
    // Work Experience (repeatable)
    {
      title: "Work Experience",
      repeatable: true,
      repeatableConfig: {
        addButtonText: "Add Experience",
        minItems: 1,
        maxItems: 10,
      },
      fields: [
        { name: "companyName", type: "text", label: "Company", cols: 1 },
        { name: "position", type: "text", label: "Position", cols: 1 },
      ],
    },
    // Education (repeatable)
    {
      title: "Education",
      repeatable: true,
      repeatableConfig: {
        addButtonText: "Add Education",
        minItems: 1,
        maxItems: 5,
      },
      fields: [
        {
          name: "institutionName",
          type: "text",
          label: "Institution",
          cols: 1,
        },
        { name: "degree", type: "text", label: "Degree", cols: 1 },
      ],
    },
    // Skills (repeatable)
    {
      title: "Skills",
      repeatable: true,
      repeatableConfig: {
        addButtonText: "Add Skill",
        minItems: 0,
        maxItems: 20,
      },
      fields: [
        { name: "skillName", type: "text", label: "Skill", cols: 1 },
        { name: "proficiency", type: "select", label: "Level", cols: 1 },
      ],
    },
  ],
};
```

---

## Data Structure / ডাটা স্ট্রাকচার

When the form is submitted, repeatable sections are stored as arrays:

```javascript
{
  name: "John Doe",
  email: "john@example.com",

  // Work Experience Array
  work_experience: [
    {
      companyName: "Google",
      position: "Software Engineer",
      startDate: "2020-01-01",
      endDate: "2022-12-31",
      description: "Worked on React projects"
    },
    {
      companyName: "Microsoft",
      position: "Senior Engineer",
      startDate: "2023-01-01",
      endDate: null,
      description: "Currently working"
    }
  ],

  // Education Array
  education: [
    {
      institutionName: "Harvard University",
      degree: "Bachelor of Science",
      graduationYear: 2019
    }
  ],

  // Skills Array
  skills: [
    { skillName: "React", proficiency: "expert" },
    { skillName: "TypeScript", proficiency: "advanced" },
    { skillName: "Node.js", proficiency: "intermediate" }
  ]
}
```

---

## Validation / ভ্যালিডেশন

### Field-Level Validation

Each field in a repeatable section can have its own validation:

```typescript
fields: [
  {
    name: "companyName",
    label: "Company Name",
    type: "text",
    validation: {
      required: "Company name is required",
      minLength: { value: 2, message: "At least 2 characters" },
    },
  },
];
```

### Min/Max Items Validation

The `minItems` and `maxItems` are automatically enforced:

```typescript
repeatableConfig: {
  minItems: 1,  // User must add at least 1 item
  maxItems: 10  // User can add maximum 10 items
}
```

When minItems is not met, a warning message is shown.
When maxItems is reached, the "Add" button is disabled.

---

## Common Use Cases / সাধারণ ব্যবহার

### 1. Resume/CV Builder

```typescript
// Work Experience, Education, Skills, Projects, Certifications
```

### 2. E-commerce Product Variants

```typescript
// Multiple sizes, colors, prices
```

### 3. Event Registration

```typescript
// Multiple attendees
```

### 4. Survey Forms

```typescript
// Multiple responses, multiple choices
```

### 5. Contact Forms

```typescript
// Multiple phone numbers, multiple addresses
```

---

## Tips & Best Practices / পরামর্শ এবং সর্বোত্তম অনুশীলন

### 1. Set Reasonable Limits

```typescript
// Good
minItems: 1,
maxItems: 10

// Too strict
minItems: 5,
maxItems: 5

// Too loose
minItems: 0,
maxItems: 999
```

### 2. Use Clear Button Text

```typescript
// Good - Specific
addButtonText: "Add Work Experience";
removeButtonText: "Remove This Experience";

// Not ideal - Generic
addButtonText: "Add";
removeButtonText: "Remove";
```

### 3. Provide Field Defaults

```typescript
fields: [
  {
    name: "currentlyWorking",
    type: "checkbox",
    label: "Currently Working",
    defaultValue: false, // Sensible default
  },
];
```

### 4. Use Appropriate Validations

```typescript
// Make critical fields required
validation: {
  required: "This field is required";
}

// Optional fields don't need validation
```

---

## Complete Examples

See these files for complete working examples:

- `src/examples/simpleFormSchema.ts` - Has Work Experience section
- `src/examples/repeatableSectionSchema.ts` - Multiple repeatable sections (Experience, Education, Skills, Projects)

---

## Technical Details / প্রযুক্তিগত বিস্তারিত

Internally, the form engine uses React Hook Form's `useFieldArray` hook:

- Each repeatable section gets a unique name based on the section title
- Items are stored as an array in the form data
- Add/remove operations update the form state automatically
- Field names are automatically prefixed with the array index (e.g., `work_experience.0.companyName`)

---

## Troubleshooting / সমস্যা সমাধান

### Issue: Data not submitting correctly

**Solution:** Make sure the section has a `title` property. This is used to generate the array name.

```typescript
{
  title: "Work Experience",  // Required for repeatable sections!
  repeatable: true,
  // ...
}
```

### Issue: Add button not working

**Solution:** Check that you haven't reached `maxItems` limit.

### Issue: Can't remove items

**Solution:** Check that you haven't reached `minItems` limit.

---

## Summary / সারাংশ

Repeatable sections মাত্র দুটি property যোগ করে তৈরি করা যায়:

```typescript
{
  repeatable: true,
  repeatableConfig: { /* options */ }
}
```

এটি automatically:

- ✅ Add/Remove buttons দেখায়
- ✅ Min/Max validation করে
- ✅ Array হিসেবে data store করে
- ✅ সব field validation কাজ করে
