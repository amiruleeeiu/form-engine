# Field-Level Validation Guide - ফিল্ড লেভেল ভ্যালিডেশন গাইড

## সারাংশ (Summary)

এখন আপনি **দুই ভাবে** validation করতে পারবেন:

1. **Zod Schema** - Centralized validation (যেমন আগে ছিল)
2. **Field-level validation** - প্রতিটি field এ আলাদা validation (নতুন!)

## 🎯 দুটো পদ্ধতি (Two Approaches)

### পদ্ধতি ১: শুধু Zod Schema (আগের মতো)

```typescript
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
});

const formSchema: FormSchema = {
  validationSchema: schema, // Zod schema
  fields: [
    { name: "name", type: "text", label: "Name" },
    { name: "email", type: "text", label: "Email" },
  ],
};
```

### পদ্ধতি ২: শুধু Field-level Validation (নতুন!)

```typescript
const formSchema: FormSchema = {
  // No Zod schema!
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      validation: {
        required: true, // "This field is required"
        minLength: {
          value: 2,
          message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে",
        },
      },
    },
    {
      name: "email",
      type: "text",
      label: "Email",
      validation: {
        required: "ইমেইল আবশ্যক", // Custom message
        email: true, // Email validation
      },
    },
  ],
};
```

### পদ্ধতি ৩: দুটো একসাথে (Best of Both!)

```typescript
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().optional(), // Zod এ optional
});

const formSchema: FormSchema = {
  validationSchema: schema, // Zod base validation
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      // Zod already handles this
    },
    {
      name: "age",
      type: "number",
      label: "Age",
      // Additional field-level validation
      validation: {
        min: { value: 18, message: "Must be 18+" },
        max: { value: 100, message: "Must be under 100" },
      },
    },
  ],
};
```

---

## 📝 Validation Options

### 1. Required Field

```typescript
validation: {
  required: true; // Default: "This field is required"
}

// অথবা custom message:
validation: {
  required: "এই ফিল্ডটি আবশ্যক";
}
```

### 2. Min/Max Length (Text)

```typescript
validation: {
  minLength: 2,  // Default message
  maxLength: 50
}

// অথবা custom message:
validation: {
  minLength: {
    value: 2,
    message: "কমপক্ষে ২ অক্ষর লিখুন"
  },
  maxLength: {
    value: 50,
    message: "সর্বোচ্চ ৫০ অক্ষর"
  }
}
```

### 3. Min/Max Value (Number)

```typescript
validation: {
  min: 18,     // Default: "Minimum value is 18"
  max: 100     // Default: "Maximum value is 100"
}

// অথবা custom message:
validation: {
  min: { value: 18, message: "আপনার বয়স ১৮+ হতে হবে" },
  max: { value: 100, message: "বয়স ১০০ এর কম হতে হবে" }
}
```

### 4. Pattern (Regular Expression)

```typescript
validation: {
  pattern: {
    value: /^01[0-9]{9}$/,
    message: "ফোন নম্বর ০১ দিয়ে শুরু হতে হবে এবং ১১ ডিজিট হতে হবে"
  }
}

// Common patterns:
// Phone: /^01[0-9]{9}$/
// Username: /^[a-zA-Z0-9_]+$/
// URL: /^https?:\/\/.+/
// Postal Code: /^[0-9]{4}$/
```

### 5. Email Validation

```typescript
validation: {
  email: true; // Default: "Invalid email address"
}

// অথবা custom message:
validation: {
  email: "দয়া করে সঠিক ইমেইল দিন";
}
```

### 6. Custom Validation Function

```typescript
validation: {
  custom: (value: string) => {
    if (!value) return true; // Let required handle empty

    // Your custom logic
    if (value.length < 5) {
      return "Value must be at least 5 characters";
    }

    if (!value.includes("@")) {
      return "Must contain @ symbol";
    }

    return true; // Validation passed
  };
}
```

---

## 🔥 Real Examples

### Example 1: Login Form (Field-level only)

```typescript
export const loginFormSchema: FormSchema = {
  fields: [
    {
      name: "email",
      label: "Email",
      type: "text",
      validation: {
        required: "ইমেইল আবশ্যক",
        email: "সঠিক ইমেইল দিন",
      },
    },
    {
      name: "password",
      label: "Password",
      type: "text",
      validation: {
        required: "পাসওয়ার্ড আবশ্যক",
        minLength: {
          value: 6,
          message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে",
        },
      },
    },
  ],
};
```

### Example 2: Phone Number Field

```typescript
{
  name: "phone",
  label: "Phone Number",
  type: "text",
  placeholder: "01XXXXXXXXX",
  validation: {
    required: true,
    pattern: {
      value: /^01[0-9]{9}$/,
      message: "বাংলাদেশি ফোন নম্বর ০১ দিয়ে শুরু হয় এবং ১১ ডিজিট হয়"
    }
  }
}
```

### Example 3: Age Field with Range

```typescript
{
  name: "age",
  label: "Age",
  type: "number",
  validation: {
    required: "বয়স আবশ্যক",
    min: {
      value: 18,
      message: "আপনার বয়স কমপক্ষে ১৮ হতে হবে"
    },
    max: {
      value: 120,
      message: "সঠিক বয়স দিন"
    }
  }
}
```

### Example 4: Username with Pattern

```typescript
{
  name: "username",
  label: "Username",
  type: "text",
  validation: {
    required: true,
    minLength: { value: 3, message: "Username must be at least 3 characters" },
    maxLength: { value: 20, message: "Username must be less than 20 characters" },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: "Only letters, numbers and underscore allowed"
    }
  }
}
```

### Example 5: Optional Field with Validation

```typescript
{
  name: "website",
  label: "Website (Optional)",
  type: "text",
  placeholder: "https://example.com",
  validation: {
    // Not required, but IF provided must be valid URL
    pattern: {
      value: /^https?:\/\/.+/,
      message: "Website must start with http:// or https://"
    }
  }
}
```

### Example 6: Password with Complex Rules

```typescript
{
  name: "password",
  label: "Password",
  type: "text",
  validation: {
    required: "Password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" },
    custom: (value: string) => {
      if (!value) return true;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*]/.test(value);

      if (!hasUpperCase) return "Must contain uppercase letter";
      if (!hasLowerCase) return "Must contain lowercase letter";
      if (!hasNumber) return "Must contain a number";
      if (!hasSpecial) return "Must contain special character (!@#$%^&*)";

      return true;
    }
  }
}
```

---

## ⚖️ Zod vs Field-level: কোনটা ব্যবহার করবেন?

| Feature        | Zod Schema                | Field-level Validation   |
| -------------- | ------------------------- | ------------------------ |
| সহজ setup      | ❌ Extra schema লিখতে হয় | ✅ Field এই সব কিছু      |
| Type safety    | ✅ TypeScript support     | ⚠️ Limited               |
| Reusable       | ✅ Schema reuse করা যায়  | ❌ Per field             |
| Complex logic  | ✅ Zod এর full power      | ⚠️ Custom function দিয়ে |
| Learning curve | ⚠️ Zod শিখতে হবে          | ✅ সহজ syntax            |
| Error messages | ✅ Custom                 | ✅ Custom                |

### সুপারিশ (Recommendation):

- 🟢 **Simple forms** → Field-level validation (সহজ!)
- 🟢 **Complex validation** → Zod schema (powerful!)
- 🟢 **Best practice** → দুটো একসাথে (flexible!)

---

## 🚀 Migration Guide

### আগের কোড (Zod only):

```typescript
const schema = z.object({
  name: z.string().min(2, "Name required"),
});

const form: FormSchema = {
  validationSchema: schema,
  fields: [{ name: "name", type: "text", label: "Name" }],
};
```

### নতুন কোড (Field-level):

```typescript
const form: FormSchema = {
  // No Zod schema needed!
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      validation: {
        required: true,
        minLength: { value: 2, message: "Name required" },
      },
    },
  ],
};
```

### দুটো একসাথে (Hybrid):

```typescript
const schema = z.object({
  name: z.string().min(2, "Name required"),
  age: z.number().optional(),
});

const form: FormSchema = {
  validationSchema: schema, // Zod base
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      // Zod handles this
    },
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

---

## 📚 Examples to Check

1. **fieldLevelValidationSchema.ts** - Field-level validation এর সম্পূর্ণ উদাহরণ
2. **simpleFormSchema.ts** - Zod schema উদাহরণ
3. **stepperFormSchema.ts** - Multi-step with Zod
4. **conditionalLogicSchema.ts** - Conditional + Zod

Run করুন:

```bash
npm run dev
```

তারপর **"Field Validation"** button ক্লিক করুন demo দেখতে!

---

## ✅ Summary

- ✅ Zod schema ব্যবহার করতে পারবেন (আগের মতো)
- ✅ Field-level validation ব্যবহার করতে পারবেন (নতুন!)
- ✅ দুটো একসাথেও ব্যবহার করতে পারবেন
- ✅ Required, min/max, pattern, email সব supported
- ✅ Custom validation function লিখতে পারবেন
- ✅ Custom error messages দিতে পারবেন (Bengali/English)
- ✅ Default error messages automatic

**আপনার requirement পূরণ হয়েছে!** 🎉
