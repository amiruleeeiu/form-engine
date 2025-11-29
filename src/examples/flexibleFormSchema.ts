import { z } from "zod";
import type { FormSchema } from "../form-engine/types/index.js";

// Example 1: Simple form with direct fields only (no sections)
export const simpleFieldsOnlySchema: FormSchema = {
  validationSchema: z.object({
    name: z.string().min(2),
    email: z.string().email(),
  }),
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      cols: 6,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      cols: 6,
    },
  ],
};

// Example 2: Simple form with sections only (no direct fields)
export const simpleSectionsOnlySchema: FormSchema = {
  validationSchema: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
  }),
  sections: [
    {
      title: "Personal Information",
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
      ],
    },
    {
      title: "Contact",
      fields: [
        {
          name: "email",
          label: "Email",
          type: "text",
          cols: 12,
        },
      ],
    },
  ],
};

// Example 3: Stepper with sections inside steps
export const stepperWithSectionsSchema: FormSchema = {
  validationSchema: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
  }),
  steps: [
    {
      title: "Step 1",
      description: "Personal details",
      sections: [
        {
          title: "Name Section",
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
          ],
        },
      ],
    },
    {
      title: "Step 2",
      description: "Address details",
      sections: [
        {
          title: "Address Section",
          fields: [
            {
              name: "address",
              label: "Address",
              type: "text",
              cols: 12,
            },
            {
              name: "city",
              label: "City",
              type: "text",
              cols: 12,
            },
          ],
        },
      ],
    },
  ],
};

// Example 4: Stepper with direct fields (no sections inside)
export const stepperWithFieldsSchema: FormSchema = {
  validationSchema: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
  }),
  steps: [
    {
      title: "Step 1",
      description: "Basic Info",
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
      ],
    },
    {
      title: "Step 2",
      description: "Contact",
      fields: [
        {
          name: "email",
          label: "Email",
          type: "text",
          cols: 12,
        },
      ],
    },
  ],
};

// Example 5: Mixed - Stepper with both sections and direct fields
export const mixedStepperSchema: FormSchema = {
  validationSchema: z.object({
    firstName: z.string().min(2),
    email: z.string().email(),
    address: z.string().min(5),
  }),
  steps: [
    {
      title: "Step 1",
      description: "Personal Info",
      // Direct fields in step
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          cols: 12,
        },
      ],
    },
    {
      title: "Step 2",
      description: "Contact & Address",
      // Sections inside step
      sections: [
        {
          title: "Contact",
          fields: [
            {
              name: "email",
              label: "Email",
              type: "text",
              cols: 12,
            },
          ],
        },
        {
          title: "Address",
          fields: [
            {
              name: "address",
              label: "Address",
              type: "text",
              cols: 12,
            },
          ],
        },
      ],
    },
  ],
};
