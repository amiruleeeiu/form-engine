import { z } from "zod";
import type { FormSchema } from "../form-engine/types/index.js";

// Validation schema for multi-step form (Optional - can use field-level validation)
const jobApplicationSchema = z.object({
  // Step 1: Personal Details
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  resume: z.any().optional(),

  // Step 2: Professional Experience
  hasExperience: z.boolean().optional(),
  yearsOfExperience: z.number().optional(),
  currentCompany: z.string().optional(),
  position: z.string().optional(),
  skills: z.any().optional(),

  // Step 3: Additional Information
  willingToRelocate: z.boolean().optional(),
  relocateCity: z.string().optional(),
  expectedSalary: z.number().optional(),
  startDate: z.string().optional(),
});

/**
 * Multi-step form with Zod validation.
 * You can also use field-level validation by adding `validation` property to any field.
 */

export const stepperFormSchema: FormSchema = {
  validationSchema: jobApplicationSchema,
  // defaultValues will be extracted from field-level `defaultValue` property
  steps: [
    {
      title: "Personal Details",
      description: "Tell us about yourself",
      fields: [
        {
          name: "fullName",
          label: "Full Name",
          type: "text",
          placeholder: "John Doe",
          cols: 12,
        },
        {
          name: "email",
          label: "Email Address",
          type: "text",
          placeholder: "john@example.com",
          cols: 6,
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "text",
          placeholder: "+880 1234567890",
          cols: 6,
        },
        {
          name: "resume",
          label: "Upload Resume",
          type: "file",
          accept: ".pdf,.doc,.docx",
          cols: 12,
        },
      ],
    },
    {
      title: "Professional Experience",
      description: "Share your work experience",
      fields: [
        {
          name: "hasExperience",
          label: "Work Experience",
          type: "checkbox",
          checkboxLabel: "I have professional work experience",
          cols: 12,
          defaultValue: false,
        },
        {
          name: "yearsOfExperience",
          label: "Years of Experience",
          type: "number",
          placeholder: "3",
          min: 0,
          max: 50,
          cols: 6,
          showWhen: {
            field: "hasExperience",
            equals: true,
          },
        },
        {
          name: "currentCompany",
          label: "Current/Last Company",
          type: "text",
          placeholder: "ABC Company",
          cols: 6,
          showWhen: {
            field: "hasExperience",
            equals: true,
          },
        },
        {
          name: "position",
          label: "Position",
          type: "text",
          placeholder: "Senior Developer",
          cols: 12,
          showWhen: {
            field: "hasExperience",
            equals: true,
          },
        },
        {
          name: "skills",
          label: "Skills",
          type: "autocomplete",
          placeholder: "Select your skills",
          isMulti: true,
          cols: 12,
          options: [
            { label: "JavaScript", value: "js" },
            { label: "TypeScript", value: "ts" },
            { label: "React", value: "react" },
            { label: "Node.js", value: "node" },
            { label: "Python", value: "python" },
            { label: "Java", value: "java" },
            { label: "SQL", value: "sql" },
            { label: "MongoDB", value: "mongodb" },
          ],
        },
      ],
    },
    {
      title: "Additional Information",
      description: "Final details",
      fields: [
        {
          name: "willingToRelocate",
          label: "Relocation",
          type: "checkbox",
          checkboxLabel: "I am willing to relocate",
          cols: 12,
          defaultValue: false,
        },
        {
          name: "relocateCity",
          label: "Preferred City",
          type: "text",
          placeholder: "City name",
          cols: 12,
          showWhen: {
            field: "willingToRelocate",
            equals: true,
          },
        },
        {
          name: "expectedSalary",
          label: "Expected Salary (USD/year)",
          type: "number",
          placeholder: "60000",
          min: 0,
          cols: 6,
        },
        {
          name: "startDate",
          label: "Available Start Date",
          type: "date",
          cols: 6,
        },
      ],
    },
  ],
};
