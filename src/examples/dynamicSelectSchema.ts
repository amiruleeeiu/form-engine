import { z } from "zod";
import type { FormSchema, SelectOption } from "../form-engine/types/index.js";

// Validation schema (Optional - can use field-level validation)
const dynamicFormSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  product: z.string().optional(),
  quantity: z.number().optional(),
});

/**
 * Dynamic form with API-driven selects and Zod validation.
 * You can also use field-level validation with the `validation` property.
 */

// Simulate API call to fetch states
const fetchStates = async (country: string): Promise<SelectOption[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const statesMap: Record<string, SelectOption[]> = {
    US: [
      { label: "California", value: "CA" },
      { label: "New York", value: "NY" },
      { label: "Texas", value: "TX" },
      { label: "Florida", value: "FL" },
    ],
    CA: [
      { label: "Ontario", value: "ON" },
      { label: "Quebec", value: "QC" },
      { label: "British Columbia", value: "BC" },
    ],
    AU: [
      { label: "New South Wales", value: "NSW" },
      { label: "Victoria", value: "VIC" },
      { label: "Queensland", value: "QLD" },
    ],
  };

  return statesMap[country] || [];
};

// Simulate API call to fetch products
const fetchProductsByCategory = async (): Promise<SelectOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    { label: "Laptop", value: "laptop" },
    { label: "Mouse", value: "mouse" },
    { label: "Keyboard", value: "keyboard" },
    { label: "Monitor", value: "monitor" },
  ];
};

export const dynamicSelectFormSchema: FormSchema = {
  validationSchema: dynamicFormSchema,
  sections: [
    {
      title: "Dynamic Select Example",
      description: "This demonstrates dynamic options loading",
      cols: 12,
      fields: [
        {
          name: "country",
          label: "Country",
          type: "select",
          placeholder: "Select country",
          cols: 6,
          options: [
            { label: "United States", value: "US" },
            { label: "Canada", value: "CA" },
            { label: "Australia", value: "AU" },
          ],
        },
        {
          name: "state",
          label: "State/Province",
          type: "select",
          placeholder: "Select state",
          cols: 6,
          // This would need enhancement to pass country value to fetch
          // For now, showing static example
          options: [
            { label: "California", value: "CA" },
            { label: "New York", value: "NY" },
            { label: "Texas", value: "TX" },
          ],
          showWhen: {
            field: "country",
            isNotEmpty: true,
          },
        },
      ],
    },
    {
      title: "Product Selection",
      cols: 12,
      fields: [
        {
          name: "category",
          label: "Category",
          type: "select",
          placeholder: "Select category",
          cols: 6,
          options: [
            { label: "Electronics", value: "electronics" },
            { label: "Books", value: "books" },
            { label: "Clothing", value: "clothing" },
          ],
        },
        {
          name: "product",
          label: "Product",
          type: "select",
          placeholder: "Select product",
          cols: 6,
          // Load products dynamically
          dynamicOptions: {
            fetchFunction: fetchProductsByCategory,
          },
          showWhen: {
            field: "category",
            equals: "electronics",
          },
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          placeholder: "1",
          min: 1,
          cols: 12,
          showWhen: {
            field: "product",
            isNotEmpty: true,
          },
        },
      ],
    },
  ],
};

// API-based dynamic options example
export const apiDrivenFormSchema: FormSchema = {
  sections: [
    {
      title: "API-Driven Select",
      description: "Options loaded from an API endpoint",
      cols: 12,
      fields: [
        {
          name: "user",
          label: "Select User",
          type: "select",
          placeholder: "Search users...",
          cols: 12,
          dynamicOptions: {
            url: "https://jsonplaceholder.typicode.com/users",
            transform: (data: any[]) =>
              data.map((user) => ({
                label: user.name,
                value: user.id,
              })),
          },
        },
      ],
    },
  ],
};
