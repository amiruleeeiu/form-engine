# Form Structure Guide - ফর্ম স্ট্রাকচার গাইড

এই গাইড দেখায় কিভাবে Form Engine এ বিভিন্ন ধরনের ফর্ম structure তৈরি করা যায়।

## বিভিন্ন ধরনের Form Structure

### ১. সাধারণ ফর্ম - শুধু Fields (কোনো Section নেই)

যখন আপনার ফর্ম খুব simple এবং sections এর প্রয়োজন নেই:

```typescript
const simpleFieldsSchema: FormSchema = {
  validationSchema: z.object({
    name: z.string().min(2),
    email: z.string().email(),
  }),
  // সরাসরি fields - কোনো section বা step নেই
  fields: [
    {
      name: "name",
      label: "নাম",
      type: "text",
      cols: 6,
    },
    {
      name: "email",
      label: "ইমেইল",
      type: "text",
      cols: 6,
    },
  ],
};
```

**ব্যবহার:** যখন আপনার ২-৩টি field আছে এবং কোনো grouping প্রয়োজন নেই।

---

### ২. সাধারণ ফর্ম - Sections সহ

যখন আপনার fields গুলোকে আলাদা আলাদা sections এ organize করতে চান:

```typescript
const simpleSectionsSchema: FormSchema = {
  validationSchema: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string(),
  }),
  // একাধিক sections, কোনো step নেই
  sections: [
    {
      title: "ব্যক্তিগত তথ্য",
      description: "আপনার নাম লিখুন",
      fields: [
        {
          name: "firstName",
          label: "প্রথম নাম",
          type: "text",
          cols: 6,
        },
        {
          name: "lastName",
          label: "শেষ নাম",
          type: "text",
          cols: 6,
        },
      ],
    },
    {
      title: "যোগাযোগের তথ্য",
      description: "আপনার যোগাযোগ মাধ্যম",
      fields: [
        {
          name: "email",
          label: "ইমেইল",
          type: "text",
          cols: 6,
        },
        {
          name: "phone",
          label: "ফোন",
          type: "text",
          cols: 6,
        },
      ],
    },
  ],
};
```

**ব্যবহার:** যখন একই পেজে একাধিক logical groups থাকবে।

---

### ৩. Multi-Step ফর্ম - সরাসরি Fields (Section ছাড়া)

যখন আপনি multi-step form চান কিন্তু প্রতিটি step এ sections প্রয়োজন নেই:

```typescript
const stepperFieldsSchema: FormSchema = {
  validationSchema: z.object({
    firstName: z.string().min(2),
    email: z.string().email(),
    address: z.string().min(5),
  }),
  steps: [
    {
      title: "ধাপ ১ - ব্যক্তিগত তথ্য",
      description: "আপনার নাম লিখুন",
      // সরাসরি fields - কোনো section নেই
      fields: [
        {
          name: "firstName",
          label: "নাম",
          type: "text",
          cols: 12,
        },
      ],
    },
    {
      title: "ধাপ ২ - যোগাযোগ",
      fields: [
        {
          name: "email",
          label: "ইমেইল",
          type: "text",
          cols: 12,
        },
      ],
    },
    {
      title: "ধাপ ৩ - ঠিকানা",
      fields: [
        {
          name: "address",
          label: "ঠিকানা",
          type: "text",
          cols: 12,
        },
      ],
    },
  ],
};
```

**ব্যবহার:** যখন প্রতিটি step সহজ এবং sections এর দরকার নেই।

---

### ৪. Multi-Step ফর্ম - Sections সহ

যখন প্রতিটি step এ একাধিক sections থাকবে:

```typescript
const stepperSectionsSchema: FormSchema = {
  validationSchema: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string(),
  }),
  steps: [
    {
      title: "ধাপ ১ - ব্যক্তিগত তথ্য",
      description: "আপনার ব্যক্তিগত তথ্য দিন",
      // Step এর ভিতরে sections
      sections: [
        {
          title: "নাম",
          fields: [
            {
              name: "firstName",
              label: "প্রথম নাম",
              type: "text",
              cols: 6,
            },
            {
              name: "lastName",
              label: "শেষ নাম",
              type: "text",
              cols: 6,
            },
          ],
        },
      ],
    },
    {
      title: "ধাপ ২ - যোগাযোগ",
      sections: [
        {
          title: "অনলাইন",
          fields: [
            {
              name: "email",
              label: "ইমেইল",
              type: "text",
              cols: 12,
            },
          ],
        },
        {
          title: "ফোন",
          fields: [
            {
              name: "phone",
              label: "মোবাইল নম্বর",
              type: "text",
              cols: 12,
            },
          ],
        },
      ],
    },
  ],
};
```

**ব্যবহার:** যখন প্রতিটি step complex এবং multiple groups প্রয়োজন।

---

### ৫. Mixed - Step এ Fields এবং Sections দুটোই

কিছু steps এ সরাসরি fields, কিছুতে sections:

```typescript
const mixedStepperSchema: FormSchema = {
  validationSchema: z.object({
    quickField: z.string(),
    detailField1: z.string(),
    detailField2: z.string(),
  }),
  steps: [
    {
      title: "ধাপ ১ - দ্রুত তথ্য",
      // সরাসরি fields (section নেই)
      fields: [
        {
          name: "quickField",
          label: "দ্রুত ফিল্ড",
          type: "text",
          cols: 12,
        },
      ],
    },
    {
      title: "ধাপ ২ - বিস্তারিত তথ্য",
      // এখানে sections আছে
      sections: [
        {
          title: "Section A",
          fields: [
            {
              name: "detailField1",
              label: "বিস্তারিত ১",
              type: "text",
              cols: 6,
            },
          ],
        },
        {
          title: "Section B",
          fields: [
            {
              name: "detailField2",
              label: "বিস্তারিত ২",
              type: "text",
              cols: 6,
            },
          ],
        },
      ],
    },
  ],
};
```

**ব্যবহার:** যখন flexibility প্রয়োজন - কিছু steps সহজ, কিছু complex।

---

## Structure Decision Tree

```
আপনার ফর্ম কি multi-step?
│
├─ না (Single Page Form)
│  │
│  ├─ Fields কি groups এ organize করা দরকার?
│  │  ├─ না → Use: fields directly (Type 1)
│  │  └─ হ্যাঁ → Use: sections (Type 2)
│  │
│
└─ হ্যাঁ (Multi-Step Form)
   │
   ├─ প্রতিটি step কি simple (few fields)?
   │  ├─ হ্যাঁ → Use: steps with direct fields (Type 3)
   │  └─ না → Continue...
   │
   ├─ প্রতিটি step এ sections দরকার?
   │  ├─ সব steps এ → Use: steps with sections (Type 4)
   │  └─ কিছুতে দরকার → Use: mixed approach (Type 5)
```

## Best Practices

### ✅ করুন:

- ছোট ফর্মের জন্য Type 1 ব্যবহার করুন
- Logical grouping এর জন্য sections ব্যবহার করুন
- বড় ফর্মকে steps এ ভাগ করুন
- User experience ভেবে structure নির্বাচন করুন

### ❌ করবেন না:

- একই সাথে root level এ `fields`, `sections`, এবং `steps` ব্যবহার করবেন না
- অপ্রয়োজনে sections তৈরি করবেন না
- খুব বেশি steps তৈরি করবেন না (৫-৭টির মধ্যে রাখুন)

## Examples ফাইল

দেখুন: `src/examples/flexibleFormSchema.ts` - সব types এর সম্পূর্ণ উদাহরণ।

## Summary

| Type | Structure                        | Use Case                     |
| ---- | -------------------------------- | ---------------------------- |
| 1    | `fields`                         | ২-৩টি simple fields          |
| 2    | `sections` → `fields`            | একাধিক logical groups        |
| 3    | `steps` → `fields`               | Multi-step, simple per step  |
| 4    | `steps` → `sections` → `fields`  | Multi-step, complex per step |
| 5    | `steps` → `fields` বা `sections` | Mixed complexity             |

আপনার project এর requirement অনুযায়ী সঠিক structure নির্বাচন করুন!
