# Quick Reference: New Field Types

## PasswordField

### Basic Usage

```typescript
{
  type: "password",
  name: "password",
  label: "Password",
  placeholder: "Enter password"
}
```

### With Validation

```typescript
{
  type: "password",
  name: "password",
  label: "Password",
  showToggle: true, // Show eye icon (default: true)
  validation: {
    required: "Password is required",
    minLength: { value: 8, message: "Min 8 characters" },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: "Must include uppercase, lowercase, and number"
    }
  }
}
```

### Password Confirmation

```typescript
{
  type: "password",
  name: "confirmPassword",
  label: "Confirm Password",
  validation: {
    required: true,
    validate: (value: string, formValues: Record<string, unknown>) =>
      value === formValues.password || "Passwords must match"
  }
}
```

---

## ProfilePictureField

### Basic Usage

```typescript
{
  type: "profilePicture",
  name: "avatar",
  label: "Profile Picture"
}
```

### With Size Limit

```typescript
{
  type: "profilePicture",
  name: "profilePicture",
  label: "Upload Photo",
  maxSize: 5 * 1024 * 1024, // 5MB in bytes
  accept: "image/*", // default value
  validation: {
    required: "Profile picture is required"
  }
}
```

### Custom File Types

```typescript
{
  type: "profilePicture",
  name: "avatar",
  label: "Avatar",
  accept: "image/png, image/jpeg", // Only PNG and JPEG
  maxSize: 2 * 1024 * 1024 // 2MB
}
```

---

## AutocompleteField

### Static Options

```typescript
{
  type: "autocomplete",
  name: "country",
  label: "Country",
  placeholder: "Select or type country",
  options: [
    { label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
    { label: "United Kingdom", value: "GB" }
  ],
  validation: {
    required: "Country is required"
  }
}
```

### Dynamic Options (API)

```typescript
{
  type: "autocomplete",
  name: "city",
  label: "City",
  placeholder: "Select city",
  dynamicOptions: {
    url: "https://api.example.com/cities",
    transform: (data) =>
      data.map((city: any) => ({
        label: city.name,
        value: city.id
      }))
  }
}
```

### With Conditional Logic

```typescript
{
  type: "autocomplete",
  name: "state",
  label: "State",
  options: [...],
  showWhen: {
    field: "country",
    equals: "US"
  }
}
```

---

## Common Properties (All Fields)

### Column Spanning

```typescript
cols: 6; // Half width (1-12, default: 12)
```

### Custom Styling

```typescript
className: "mb-4",              // Container
labelClassName: "font-bold",     // Label
inputClassName: "border-2",      // Input
errorClassName: "text-red-500"   // Error message
```

### Conditional Logic

```typescript
showWhen: { field: "userType", equals: "admin" },
hideWhen: { field: "userType", equals: "guest" },
enableWhen: { field: "agree", equals: true },
disableWhen: { field: "locked", equals: true }
```

### Validation Options

```typescript
validation: {
  required: true | "Error message",
  minLength: 5 | { value: 5, message: "Too short" },
  maxLength: 20 | { value: 20, message: "Too long" },
  pattern: { value: /regex/, message: "Invalid format" },
  email: true | "Invalid email",
  custom: (value) => value !== "banned" || "Value not allowed",
  validate: (value, formValues) => /* custom logic */
}
```

---

## Complete Example: User Profile Form

```typescript
import type { FormSchema } from "./form-engine/types";

export const profileSchema: FormSchema = {
  sections: [
    {
      title: "User Profile",
      fields: [
        {
          type: "profilePicture",
          name: "avatar",
          label: "Profile Picture",
          maxSize: 5 * 1024 * 1024,
          cols: 12,
        },
        {
          type: "text",
          name: "username",
          label: "Username",
          cols: 6,
          validation: { required: true, minLength: 3 },
        },
        {
          type: "text",
          name: "email",
          label: "Email",
          cols: 6,
          validation: { required: true, email: true },
        },
        {
          type: "password",
          name: "password",
          label: "Password",
          cols: 6,
          showToggle: true,
          validation: {
            required: true,
            minLength: { value: 8, message: "Min 8 chars" },
          },
        },
        {
          type: "password",
          name: "confirmPassword",
          label: "Confirm Password",
          cols: 6,
          validation: {
            required: true,
            validate: (value, form) =>
              value === form.password || "Passwords don't match",
          },
        },
        {
          type: "autocomplete",
          name: "country",
          label: "Country",
          cols: 12,
          options: [
            { label: "USA", value: "us" },
            { label: "Canada", value: "ca" },
          ],
        },
      ],
    },
  ],
};
```

---

## Tips

### File Size Limits

- 1 MB = `1024 * 1024`
- 5 MB = `5 * 1024 * 1024`
- 10 MB = `10 * 1024 * 1024`

### Password Patterns

```typescript
// At least 8 chars, 1 uppercase, 1 lowercase, 1 number
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

// Include special character
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
```

### Image Accept Types

```typescript
accept: "image/*"; // All images
accept: "image/png, image/jpeg"; // Only PNG and JPEG
accept: "image/png"; // Only PNG
```
