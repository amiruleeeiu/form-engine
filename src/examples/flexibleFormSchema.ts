/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormSchema } from "../form-engine/types/index.js";

// Example 1: Simple form with direct fields only (no sections)
export const simpleFieldsOnlySchema: FormSchema = {
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      cols: 6,
      validation: {
        required: true,
        minLength: { value: 2, message: "Name must be at least 2 characters" },
      },
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      cols: 6,
      validation: {
        required: true,
        email: "Please enter a valid email address",
      },
    },
  ],
};

// Example 2: Simple form with sections only (no direct fields)
export const simpleSectionsOnlySchema: FormSchema = {
  sections: [
    {
      title: "Personal Information",
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          cols: 6,
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
          cols: 6,
          validation: {
            required: true,
            minLength: {
              value: 2,
              message: "Last name must be at least 2 characters",
            },
          },
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
          validation: {
            required: "Email is required",
            email: true,
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
            min: { value: 18, message: "Age must be at least 18" },
            max: { value: 120, message: "Age must be less than 120" },
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
              message: "Phone number must start with 01 and be 11 digits",
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
            required: "Division is required",
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
            required: "District is required",
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
            required: "Sub-District is required",
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

// Example 3: Stepper with sections inside steps
export const stepperWithSectionsSchema: FormSchema = {
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
              cols: 6,
              validation: {
                required: true,
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
              },
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
              validation: {
                required: true,
                minLength: {
                  value: 5,
                  message: "Address must be at least 5 characters",
                },
              },
            },
            {
              name: "city",
              label: "City",
              type: "text",
              cols: 12,
              validation: {
                required: true,
                minLength: {
                  value: 2,
                  message: "City name must be at least 2 characters",
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

// Example 4: Stepper with direct fields (no sections inside)
export const stepperWithFieldsSchema: FormSchema = {
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
          cols: 6,
          validation: {
            required: true,
            minLength: {
              value: 2,
              message: "Last name must be at least 2 characters",
            },
          },
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
          validation: {
            required: "Email is required",
            email: true,
          },
        },
      ],
    },
  ],
};

// Example 5: Mixed - Stepper with both sections and direct fields
export const mixedStepperSchema: FormSchema = {
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
          validation: {
            required: true,
            minLength: {
              value: 2,
              message: "First name must be at least 2 characters",
            },
          },
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
              validation: {
                required: "Email is required",
                email: true,
              },
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
              validation: {
                required: true,
                minLength: {
                  value: 5,
                  message: "Address must be at least 5 characters",
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
                required: "Division is required",
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
                required: "District is required",
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
                required: "Sub-District is required",
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
    },
  ],
};
