/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormSchema } from "../form-engine/types/index.js";

/**
 * Example: Form with API Data Sources
 *
 * This example demonstrates how to use read-only fields with API data.
 * Multiple API endpoints can fetch data for different fields/sections/steps.
 */

export const apiDataFormSchema: FormSchema = {
  // Define your API data sources
  dataSources: [
    {
      id: "userProfile",
      url: "http://localhost:3000/userInfo",
      method: "GET",
      // Optional: Transform the API response
      transform: (data: any) => ({
        fullName: data.name,
        email: data.email,
        phone: data.phone,
      }),
    },
    {
      id: "companyInfo",
      url: "http://localhost:3000/company",
      method: "GET",
    },
    {
      id: "addressInfo",
      url: "/api/user/address",
      method: "POST",
      params: { userId: "123" },
    },
  ],

  steps: [
    {
      title: "User Information",
      description: "Your profile information (read-only)",
      // Optional: Data source for entire step
      dataSourceId: "userProfile",
      fields: [
        {
          name: "userName",
          label: "Full Name",
          type: "text",
          readOnly: true,
          dataSourceId: "userProfile",
          dataPath: "fullName", // Path in the API response
          cols: 1,
        },
        {
          name: "userEmail",
          label: "Email Address",
          type: "text",
          readOnly: true,
          dataSourceId: "userProfile",
          dataPath: "email",
          cols: 1,
        },
        {
          name: "userPhone",
          label: "Phone Number",
          type: "text",
          readOnly: true,
          dataSourceId: "userProfile",
          dataPath: "phone",
          cols: 2,
        },
      ],
    },
    {
      title: "Company Details",
      description: "Company information from API",
      sections: [
        {
          title: "Company Information",
          dataSourceId: "companyInfo",
          fields: [
            {
              name: "companyName",
              label: "Company Name",
              type: "text",
              readOnly: true,
              dataSourceId: "companyInfo",
              dataPath: "companyName",
              cols: 1,
            },
            {
              name: "companyRegistration",
              label: "Registration Number",
              type: "text",
              readOnly: true,
              dataSourceId: "companyInfo",
              dataPath: "registrationNumber",
              cols: 1,
            },
            {
              name: "companyEmail",
              label: "Company Email",
              type: "text",
              readOnly: true,
              dataSourceId: "companyInfo",
              dataPath: "email",
              cols: 2,
            },
          ],
        },
        {
          title: "Address Information",
          dataSourceId: "addressInfo",
          fields: [
            {
              name: "street",
              label: "Street Address",
              type: "text",
              readOnly: true,
              dataSourceId: "companyInfo",
              dataPath: "address.street",
              cols: 2,
            },
            {
              name: "city",
              label: "City",
              type: "text",
              readOnly: true,
              dataSourceId: "companyInfo",
              dataPath: "address.city",
              cols: 1,
            },
            {
              name: "postalCode",
              label: "Postal Code",
              type: "text",
              readOnly: true,
              dataSourceId: "companyInfo",
              dataPath: "address.postalCode",
              cols: 1,
            },
          ],
        },
      ],
    },
    {
      title: "Additional Information",
      description: "You can edit these fields",
      fields: [
        {
          name: "notes",
          label: "Notes",
          type: "textarea",
          placeholder: "Add any additional notes...",
          cols: 2,
        },
        {
          name: "agreeToTerms",
          label: "I agree to the terms and conditions",
          type: "checkbox",
          checkboxLabel: "I agree to the terms and conditions",
          cols: 2,
        },
      ],
    },
  ],
};

/**
 * Example: Simple form with mixed read-only and editable fields
 */
export const mixedFieldsSchema: FormSchema = {
  dataSources: [
    {
      id: "currentUser",
      url: "/api/current-user",
      method: "GET",
    },
  ],

  sections: [
    {
      title: "Your Profile",
      fields: [
        // Read-only from API
        {
          name: "userId",
          label: "User ID",
          type: "text",
          readOnly: true,
          dataSourceId: "currentUser",
          dataPath: "id",
          cols: 1,
        },
        {
          name: "registeredDate",
          label: "Registered Date",
          type: "text",
          readOnly: true,
          dataSourceId: "currentUser",
          dataPath: "createdAt",
          cols: 1,
        },
        // Editable fields
        {
          name: "displayName",
          label: "Display Name",
          type: "text",
          placeholder: "Enter your display name",
          cols: 1,
        },
        {
          name: "bio",
          label: "Bio",
          type: "textarea",
          placeholder: "Tell us about yourself",
          rows: 4,
          cols: 2,
        },
      ],
    },
  ],
};

/**
 * Mock API endpoints for testing
 *
 * In a real application, replace these with actual API calls:
 *
 * GET /api/user/profile
 * Response: { firstName: "John", lastName: "Doe", emailAddress: "john@example.com", phoneNumber: "+8801234567890" }
 *
 * GET /api/company/details
 * Response: { name: "Acme Corp", registrationNumber: "123456", email: "info@acme.com" }
 *
 * POST /api/user/address
 * Body: { userId: "123" }
 * Response: { street: "123 Main St", city: "Dhaka", postalCode: "1000" }
 *
 * GET /api/current-user
 * Response: { id: "USR001", createdAt: "2024-01-15" }
 */
