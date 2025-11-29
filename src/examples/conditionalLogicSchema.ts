import { z } from "zod";
import type { FormSchema } from "../form-engine/types/index.js";

// Complex conditional validation (Optional - can use field-level validation)
const conditionalFormSchema = z.object({
  userType: z.string().min(1, "User type is required"),
  companyName: z.string().optional(),
  taxId: z.string().optional(),

  hasVehicle: z.boolean().optional(),
  vehicleType: z.string().optional(),
  licensePlate: z.string().optional(),

  age: z.number().min(0, "Age must be positive"),
  drivingLicense: z.any().optional(),

  subscription: z.string().optional(),
  numberOfUsers: z.number().optional(),

  country: z.string().optional(),
  bankAccount: z.string().optional(),
});

/**
 * Form with complex conditional logic and Zod validation.
 * Alternative: Use field-level validation with `validation` property.
 */

export const conditionalLogicFormSchema: FormSchema = {
  validationSchema: conditionalFormSchema,
  defaultValues: {
    hasVehicle: false,
  },
  sections: [
    {
      title: "User Type",
      cols: 12,
      fields: [
        {
          name: "userType",
          label: "User Type",
          type: "radio",
          cols: 12,
          options: [
            { label: "Individual", value: "individual" },
            { label: "Business", value: "business" },
          ],
        },
      ],
    },
    {
      title: "Business Information",
      description: "Required for business accounts",
      cols: 12,
      // Show this entire section only if user type is business
      showWhen: {
        field: "userType",
        equals: "business",
      },
      fields: [
        {
          name: "companyName",
          label: "Company Name",
          type: "text",
          placeholder: "ABC Corporation",
          cols: 6,
        },
        {
          name: "taxId",
          label: "Tax ID",
          type: "text",
          placeholder: "12-3456789",
          cols: 6,
        },
      ],
    },
    {
      title: "Vehicle Information",
      cols: 12,
      fields: [
        {
          name: "hasVehicle",
          label: "Vehicle Ownership",
          type: "checkbox",
          checkboxLabel: "I own a vehicle",
          cols: 12,
        },
        {
          name: "vehicleType",
          label: "Vehicle Type",
          type: "select",
          placeholder: "Select type",
          cols: 6,
          options: [
            { label: "Car", value: "car" },
            { label: "Motorcycle", value: "motorcycle" },
            { label: "Truck", value: "truck" },
          ],
          showWhen: {
            field: "hasVehicle",
            equals: true,
          },
        },
        {
          name: "licensePlate",
          label: "License Plate",
          type: "text",
          placeholder: "ABC-1234",
          cols: 6,
          showWhen: {
            field: "hasVehicle",
            equals: true,
          },
        },
      ],
    },
    {
      title: "Age Verification",
      cols: 12,
      fields: [
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "25",
          min: 0,
          max: 120,
          cols: 12,
        },
        {
          name: "drivingLicense",
          label: "Driving License",
          type: "file",
          accept: "image/*,.pdf",
          cols: 12,
          // Only show if age >= 18
          showWhen: {
            field: "age",
            greaterThan: 17,
          },
        },
      ],
    },
    {
      title: "Subscription Plan",
      cols: 12,
      fields: [
        {
          name: "subscription",
          label: "Plan Type",
          type: "select",
          placeholder: "Choose plan",
          cols: 12,
          options: [
            { label: "Free", value: "free" },
            { label: "Basic", value: "basic" },
            { label: "Premium", value: "premium" },
            { label: "Enterprise", value: "enterprise" },
          ],
        },
        {
          name: "numberOfUsers",
          label: "Number of Users",
          type: "number",
          placeholder: "5",
          min: 1,
          cols: 12,
          // Only show for enterprise plan
          showWhen: {
            field: "subscription",
            equals: "enterprise",
          },
        },
      ],
    },
    {
      title: "Banking Details",
      cols: 12,
      fields: [
        {
          name: "country",
          label: "Country",
          type: "select",
          placeholder: "Select country",
          cols: 6,
          options: [
            { label: "Bangladesh", value: "BD" },
            { label: "United States", value: "US" },
            { label: "United Kingdom", value: "UK" },
          ],
        },
        {
          name: "bankAccount",
          label: "Bank Account",
          type: "text",
          placeholder: "Account number",
          cols: 6,
          // Enable only if country is Bangladesh
          enableWhen: {
            field: "country",
            equals: "BD",
          },
        },
      ],
    },
  ],
};
