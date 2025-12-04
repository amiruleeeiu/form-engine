import type { FormSchema } from "../form-engine/types/index.js";

/**
 * Simple Form Example - Field-Level Validation Only
 *
 * এই example এ শুধু field-level validation ব্যবহার করা হয়েছে।
 * কোনো Zod schema নেই! সব validation সরাসরি field এ দেওয়া আছে।
 *
 * This example uses ONLY field-level validation.
 * No Zod schema required! All validation is directly in the fields.
 */

export const simpleFormSchema: FormSchema = {
  // No validationSchema! Using field-level validation only
  // No defaultValues here! They are defined in each field using `defaultValue` property
  sections: [
    {
      title: "Personal Information",
      description: "Please provide your basic information",
      cols: 12,
      className: "bg-blue-50 p-4 rounded-md",
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          placeholder: "Enter your first name",
          cols: 1, // Half row on desktop, full on mobile
          validation: {
            required: true,
            minLength: {
              value: 2,
              message: "First name must be at least 2 characters",
            },
          },
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          placeholder: "Enter your last name",
          cols: 1, // Half row on desktop, full on mobile
          validation: {
            required: true,
            minLength: {
              value: 2,
              message: "Last name must be at least 2 characters",
            },
          },
        },
        {
          name: "email",
          label: "Email Address",
          type: "text",
          placeholder: "your.email@example.com",
          cols: 1,
          validation: {
            required: true,
            email: "Invalid email address",
          },
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "25",
          min: 18,
          max: 120,
          cols: 1,
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
          },
        },
        {
          name: "postalCode",
          label: "Postal Code (Numeric String)",
          type: "number",
          placeholder: "12345",
          maxLength: 10,
          cols: 1,
          validation: {
            required: "Postal code is required",
            minLength: {
              value: 4,
              message: "Postal code must be at least 4 digits",
            },
          },
        },
        {
          name: "dateOfBirth",
          label: "Date of Birth",
          type: "date",
          cols: 2, // Full row on desktop and mobile
          validation: {
            required: "Date of birth is required",
          },
        },
      ],
    },
    {
      title: "Address",
      description: "Where do you live?",
      cols: 12,
      fields: [
        {
          name: "country",
          label: "Country",
          type: "select",
          placeholder: "Select your country",
          cols: 6,
          options: [
            { label: "Bangladesh", value: "BD" },
            { label: "United States", value: "US" },
            { label: "United Kingdom", value: "UK" },
            { label: "Canada", value: "CA" },
            { label: "Australia", value: "AU" },
          ],
          validation: {
            required: "Country is required",
          },
        },
        {
          name: "skills",
          label: "Skills (Multiple Select)",
          type: "select",
          placeholder: "Select your skills",
          cols: 6,
          isMulti: true,
          options: [
            { label: "JavaScript", value: "js" },
            { label: "TypeScript", value: "ts" },
            { label: "React", value: "react" },
            { label: "Vue", value: "vue" },
            { label: "Angular", value: "angular" },
            { label: "Node.js", value: "node" },
            { label: "Python", value: "python" },
            { label: "Java", value: "java" },
            { label: "PHP", value: "php" },
            { label: "Ruby", value: "ruby" },
          ],
          validation: {
            required: "Please select at least one skill",
          },
        },
        {
          name: "city",
          label: "City",
          type: "text",
          placeholder: "Enter your city",
          cols: 6,
          // Only show city field if country is selected
          showWhen: {
            field: "country",
            isNotEmpty: true,
          },
          validation: {
            minLength: {
              value: 2,
              message: "City name must be at least 2 characters",
            },
          },
        },
      ],
    },
    {
      title: "Marital Status",
      cols: 12,
      fields: [
        {
          name: "isMarried",
          label: "Are you married?",
          type: "checkbox",
          checkboxLabel: "Yes, I am married",
          cols: 12,
          defaultValue: false, // Default value in field
        },
        {
          name: "spouseName",
          label: "Spouse's Name",
          type: "text",
          placeholder: "Enter your spouse's name",
          cols: 12,
          // Only show if married
          showWhen: {
            field: "isMarried",
            equals: true,
          },
          validation: {
            minLength: {
              value: 2,
              message: "Spouse name must be at least 2 characters",
            },
          },
        },
      ],
    },
    {
      title: "Work Experience",
      description: "Add your work experience (you can add multiple)",
      cols: 12,
      repeatable: true, // This makes it a repeatable section
      repeatableConfig: {
        addButtonText: "Add Experience",
        removeButtonText: "Remove",
        initialItems: 2,
        minItems: 1,
        maxItems: 10,
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
            minLength: {
              value: 2,
              message: "Company name must be at least 2 characters",
            },
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
    {
      title: "Account Settings",
      cols: 12,
      fields: [
        {
          name: "accountType",
          label: "Account Type",
          type: "radio",
          cols: 12,
          options: [
            { label: "Personal", value: "personal" },
            { label: "Business", value: "business" },
            { label: "Enterprise", value: "enterprise" },
          ],
          validation: {
            required: "Account type is required",
          },
        },
        {
          name: "interests",
          label: "Interests",
          type: "select",
          placeholder: "Select your interests",
          isMulti: true,
          cols: 12,
          options: [
            { label: "Technology", value: "tech" },
            { label: "Sports", value: "sports" },
            { label: "Music", value: "music" },
            { label: "Travel", value: "travel" },
            { label: "Reading", value: "reading" },
            { label: "Gaming", value: "gaming" },
          ],
        },
        {
          name: "profilePicture",
          label: "Profile Picture",
          type: "file",
          accept: "image/*",
          cols: 6,
        },
        {
          name: "newsletter",
          label: "Newsletter",
          type: "checkbox",
          checkboxLabel: "Subscribe to our newsletter",
          cols: 6,
          defaultValue: false, // Default value in field
        },
      ],
    },
  ],
};
