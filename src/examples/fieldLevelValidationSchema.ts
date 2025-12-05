/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import type { FormSchema } from "../form-engine/types/index.js";

/**
 * Example showing field-level validation (without Zod schema)
 * আপনি চাইলে শুধু field level এ validation দিতে পারবেন
 */
export const fieldLevelValidationSchema: FormSchema = {
  // No Zod schema! Validation শুধু field level এ
  defaultValues: {
    newsletter: false,
  },
  sections: [
    {
      title: "Personal Information",
      description: "Field-level validation এর উদাহরণ",
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          placeholder: "Enter your first name",
          cols: 6,
          // Field-level validation
          validation: {
            required: true, // Default message: "This field is required"
            minLength: {
              value: 2,
              message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে", // Custom message
            },
          },
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          placeholder: "Enter your last name",
          cols: 6,
          validation: {
            required: "শেষ নাম আবশ্যক", // Custom required message
            minLength: 2, // Will use default message
          },
        },
        {
          name: "email",
          label: "Email Address",
          type: "text",
          placeholder: "your.email@example.com",
          cols: 12,
          validation: {
            required: true,
            email: "দয়া করে সঠিক ইমেইল দিন", // Custom email error
          },
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "25",
          cols: 6,
          validation: {
            required: true,
            min: {
              value: 18,
              message: "আপনার বয়স কমপক্ষে ১৮ হতে হবে",
            },
            max: {
              value: 120,
              message: "Invalid age",
            },
          },
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "text",
          placeholder: "01XXXXXXXXX",
          cols: 6,
          validation: {
            required: true,
            pattern: {
              value: /^01[0-9]{9}$/,
              message: "ফোন নম্বর 01 দিয়ে শুরু হতে হবে এবং ১১ ডিজিটের হতে হবে",
            },
          },
        },
        {
          name: "username",
          label: "Username",
          type: "text",
          placeholder: "Choose a username",
          cols: 12,
          validation: {
            required: true,
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
            maxLength: {
              value: 20,
              message: "Username must be less than 20 characters",
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message:
                "Username can only contain letters, numbers and underscore",
            },
          },
        },
        {
          name: "website",
          label: "Website (Optional)",
          type: "text",
          placeholder: "https://example.com",
          cols: 12,
          validation: {
            // Not required, but if provided must match pattern
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Website must start with http:// or https://",
            },
          },
        },
      ],
    },
    {
      title: "Location Selection",
      description: "Select your division, district, and sub-district",
      fields: [
        {
          name: "division",
          label: "Division",
          type: "select",
          placeholder: "Select division",
          cols: 4,
          validation: {
            required: "বিভাগ নির্বাচন আবশ্যক",
          },
          dynamicOptions: {
            url: "http://localhost:3000/division",
            transform: (data: any[]) =>
              data.map((item: any) => ({
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
            required: "জেলা নির্বাচন আবশ্যক",
          },
          dynamicOptions: {
            url: "http://localhost:3000/district",
            transform: (data: any[]) =>
              data.map((item: any) => ({
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
            required: "উপজেলা নির্বাচন আবশ্যক",
          },
          dynamicOptions: {
            url: "http://localhost:3000/sub-district",
            transform: (data: any[]) =>
              data.map((item: any) => ({
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

/**
 * Example combining Zod schema + field-level validation
 * দুটোই একসাথে ব্যবহার করা যায়
 */
const mixedValidationSchema = z.object({
  name: z.string().min(1, "Name is required from Zod"),
  email: z.string().email("Email from Zod"),
  age: z.number().optional(),
});

export const mixedValidationFormSchema: FormSchema = {
  validationSchema: mixedValidationSchema, // Zod schema
  sections: [
    {
      title: "Mixed Validation",
      description: "Zod + Field-level validation একসাথে",
      fields: [
        {
          name: "name",
          label: "Name",
          type: "text",
          cols: 12,
          // Zod schema এ validation আছে, field level এ দরকার নেই
        },
        {
          name: "email",
          label: "Email",
          type: "text",
          cols: 12,
          // Zod schema এ email validation আছে
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          cols: 12,
          // Zod এ optional, কিন্তু field level এ আরো validation যোগ করা
          validation: {
            min: { value: 18, message: "Must be 18+" },
            max: { value: 100 },
          },
        },
      ],
    },
  ],
};

/**
 * Example with custom validation function
 * নিজের custom validation function লিখতে পারবেন
 */
export const customValidationSchema: FormSchema = {
  sections: [
    {
      title: "Custom Validation",
      fields: [
        {
          name: "password",
          label: "Password",
          type: "text",
          cols: 12,
          validation: {
            required: true,
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            custom: (value: string) => {
              // Custom validation logic
              if (!value) return true; // Let required handle empty

              const hasUpperCase = /[A-Z]/.test(value);
              const hasLowerCase = /[a-z]/.test(value);
              const hasNumber = /[0-9]/.test(value);

              if (!hasUpperCase) {
                return "Password must contain at least one uppercase letter";
              }
              if (!hasLowerCase) {
                return "Password must contain at least one lowercase letter";
              }
              if (!hasNumber) {
                return "Password must contain at least one number";
              }

              return true; // Validation passed
            },
          },
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "text",
          cols: 12,
          validation: {
            required: true,
            // Custom validation to match password
            // Note: You need access to other field values for this
            // This is a simplified example
          },
        },
      ],
    },
  ],
};
