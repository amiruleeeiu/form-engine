# Simple Form Schema - Field-Level Validation Only ✅

## 🎉 Zod Schema সম্পূর্ণ সরানো হয়েছে!

এই example এ **শুধু field-level validation** ব্যবহার করা হয়েছে।

- ❌ কোনো Zod schema নেই
- ✅ সব validation সরাসরি field এ
- ✅ `import { z } from "zod"` remove করা হয়েছে

## সব fields এ validation যোগ করা হয়েছে!

### Personal Information Section:

#### 1. First Name

```typescript
validation: {
  required: true,
  minLength: {
    value: 2,
    message: "First name must be at least 2 characters",
  },
}
```

#### 2. Last Name

```typescript
validation: {
  required: true,
  minLength: {
    value: 2,
    message: "Last name must be at least 2 characters",
  },
}
```

#### 3. Email

```typescript
validation: {
  required: true,
  email: "Invalid email address",
}
```

#### 4. Age

```typescript
validation: {
  required: true,
  min: {
    value: 18,
    message: "Must be at least 18 years old",
  },
  max: {
    value: 120,
    message: "Invalid age",
  },
}
```

#### 5. Date of Birth

```typescript
validation: {
  required: "Date of birth is required",
}
```

---

### Address Section:

#### 6. Country

```typescript
validation: {
  required: "Country is required",
}
```

#### 7. City

```typescript
validation: {
  minLength: {
    value: 2,
    message: "City name must be at least 2 characters",
  },
}
// Note: Not required, but if provided must be at least 2 characters
```

---

### Marital Status Section:

#### 8. Is Married (Checkbox)

```typescript
// No validation needed for checkbox
```

#### 9. Spouse Name

```typescript
validation: {
  minLength: {
    value: 2,
    message: "Spouse name must be at least 2 characters",
  },
}
// Note: Only shows when married, not required but validated if shown
```

---

### Account Settings Section:

#### 10. Account Type

```typescript
validation: {
  required: "Account type is required",
}
```

#### 11. Interests (Autocomplete)

```typescript
// No validation - optional field
```

#### 12. Profile Picture (File)

```typescript
// No validation - optional field
```

#### 13. Newsletter (Checkbox)

```typescript
// No validation - optional field
```

---

## Summary

### ✅ Required Fields (9):

1. First Name - required + minLength
2. Last Name - required + minLength
3. Email - required + email format
4. Age - required + min + max
5. Date of Birth - required
6. Country - required
7. Account Type - required

### ⚠️ Optional but Validated (2):

8. City - minLength if provided
9. Spouse Name - minLength if provided

### ℹ️ Optional (4):

10. Is Married - checkbox
11. Interests - autocomplete
12. Profile Picture - file
13. Newsletter - checkbox

---

## Test করুন:

```bash
npm run dev
```

1. "Simple Form" button ক্লিক করুন
2. Submit করার চেষ্টা করুন খালি রেখে
3. দেখুন সব validation message ঠিকমতো দেখাচ্ছে কিনা
4. সঠিক data দিয়ে submit করুন

---

## Validation Behavior:

### ✅ Shows "This field is required":

- যেখানে `required: true` দেওয়া হয়েছে

### ✅ Shows Custom Message:

- যেখানে `required: "Custom message"` দেওয়া হয়েছে
- যেখানে `minLength`, `max`, `min` এ custom message আছে

### ✅ Email Validation:

- Email field এ সঠিক email format check করে

### ✅ Number Range:

- Age field ১৮-১২০ এর মধ্যে হতে হবে

### ✅ Conditional Validation:

- City field শুধু দেখায় যখন country selected
- Spouse name শুধু দেখায় যখন married checked

---

## কোড দেখুন:

`src/examples/simpleFormSchema.ts` file এ সব validation দেখতে পাবেন।

**সব validation ঠিকমতো যোগ করা হয়েছে! ✨**
