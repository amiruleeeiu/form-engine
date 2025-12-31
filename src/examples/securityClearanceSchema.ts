/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormSchema } from "../form-engine/types/index.js";

/**
 * Security Clearance Application Form
 *
 * This is a comprehensive security clearance form with:
 * - Multiple steps covering all aspects of security clearance
 * - Complex conditional logic for address sections (Bangladesh residential addresses)
 * - Repeatable sections for passport details and travel history
 * - Multiple file uploads with centralized upload configuration
 * - Company information, expatriate details, compensation, manpower statistics
 * - Various field types and validations
 */

export const securityClearanceSchema: FormSchema = {
  // Centralized file upload configuration
  uploadSources: [
    {
      id: "document-upload",
      url: "http://localhost:3000/api/upload",
      method: "POST",
      fieldName: "file",
      additionalData: {
        folder: "security-clearance-documents",
        category: "official",
      },
      transform: (response) => {
        return response.file?.path || response.url;
      },
    },
    {
      id: "image-upload",
      url: "http://localhost:3000/api/upload",
      method: "POST",
      fieldName: "image",
      additionalData: {
        folder: "profile-pictures",
        resize: "300x300",
      },
      transform: (response) => response.file?.path,
    },
  ],

  steps: [
    {
      title: "Bank Details",
      description: "Expatriate/Employee banking information",
      sections: [
        {
          title: "Expatriate/Employee Bank Details",
          fieldGroup: "bank_info",
          fields: [
            {
              name: "acc_holder_name",
              label: "Account Holder Name",
              type: "text",
              placeholder: "Enter account holder name",
              cols: 1,
              validation: {
                required: true,
                maxLength: 100,
              },
            },
            {
              name: "bank_name",
              label: "Bank name",
              type: "select",
              placeholder: "Select bank",
              cols: 1,
              options: [
                { value: "", label: "Select one" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
              validation: {
                required: true,
                maxLength: 100,
              },
            },
            {
              name: "branch_name",
              label: "Branch name",
              type: "text",
              placeholder: "Enter branch name",
              cols: 1,
              validation: {
                required: true,
                maxLength: 100,
              },
            },
            {
              name: "bank_acc_number",
              label: "Bank Account Number",
              type: "text",
              placeholder: "Enter bank account number",
              cols: 1,
            },
            {
              name: "bank_statement",
              label: "Bank Statement",
              type: "dropzone",
              placeholder: "Choose file",
              cols: 6,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "N.B: Maximum PDF file upload size 2MB",
            },
          ],
        },
      ],
    },

    // ==================== STEP 3: Tax Identification ====================
    {
      title: "Tax Identification Details How mane items",
      description: "Tax information for expatriate/employee",
      sections: [
        {
          title: "Expatriate/Employee Tax Identification Details",
          fieldGroup: "tin_info",
          fields: [
            {
              name: "tin_number",
              label: "TIN Number",
              type: "text",
              placeholder: "Enter TIN number",
              cols: 12,
              validation: {
                required: true,
                maxLength: 100,
              },
            },
            {
              name: "tin_certificate",
              label: "TIN Certificate",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "N.B: Maximum PDF file upload size 2MB",
            },
          ],
        },
      ],
    },

    // ==================== STEP 4: Residential Address ====================
    {
      title: "Residential Address",
      description: "Address information (Abroad and Bangladesh)",
      sections: [
        // Abroad Address
        {
          title: "Residential Address (Abroad)",
          fieldGroup: "residential_info.abroad_address",
          fields: [
            {
              name: "country",
              label: "Country",
              type: "select",
              placeholder: "Select country",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                url: "http://localhost:3000/country",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "state_province_region",
              label: "State / Province / Region",
              type: "text",
              placeholder: "Enter state/province/region",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "city_town",
              label: "City / Town",
              type: "text",
              placeholder: "Enter city/town",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "postal_code_zip_code",
              label: "Postal Code / ZIP Code",
              type: "text",
              placeholder: "Enter postal code",
              cols: 1,
              validation: {
                required: false,
                maxLength: 20,
              },
            },
            {
              name: "street_address",
              label: "Street Address",
              type: "textarea",
              placeholder: "Enter street address",
              cols: 12,
              validation: {
                required: false,
                maxLength: 500,
              },
            },
          ],
        },

        // Bangladesh Address - Accommodation Type
        {
          title: "Residential Address (Bangladesh)",
          fields: [
            {
              name: "accommodation_type",
              label: "Accommodation Type",
              type: "radio",
              cols: 12,
              clearFields: [
                "accommodation_status_company",
                "accommodation_status_self",
                "accommodation_location",
              ],
              validation: {
                required: false,
              },
              options: [
                { value: "arranged_by_company", label: "Arranged by Company" },
                {
                  value: "self_arrangement",
                  label: "Self Arrangement by Expatriate/Employee",
                },
              ],
            },
            {
              name: "accommodation_status_company",
              label: "Accommodation Status",
              type: "radio",
              cols: 12,
              showWhen: {
                field: "accommodation_type",
                equals: "arranged_by_company",
              },
              clearFields: ["accommodation_location"],
              validation: {
                required: false,
              },
              options: [
                { value: "rented_by_company", label: "Rented by Company" },
                { value: "company_owned", label: "Company Owned" },
              ],
            },
            {
              name: "accommodation_status_self",
              label: "Accommodation Status",
              type: "radio",
              cols: 12,
              showWhen: {
                field: "accommodation_type",
                equals: "self_arrangement",
              },
              validation: {
                required: false,
              },
              options: [
                { value: "regular", label: "Regular" },
                { value: "temporary", label: "Temporary" },
              ],
            },
            {
              name: "accommodation_location",
              label: "Accommodation Location",
              type: "radio",
              cols: 12,
              showWhen: {
                field: "accommodation_status_company",
                equals: "company_owned",
              },
              validation: {
                required: false,
              },
              options: [
                { value: "within_factory", label: "Within Factory" },
                { value: "outside_factory", label: "Outside Factory" },
              ],
            },
          ],
        },

        // Factory Address (Within Factory)
        {
          title: "Factory Address",
          fieldGroup:
            "residential_info.bangladesh_address.company_owned_within_factory",
          showWhen: {
            field: "accommodation_location",
            equals: "within_factory",
          },
          clearOnHide: true,
          fields: [
            {
              name: "district",
              label: "District",
              type: "select",
              placeholder: "Select district",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                url: "http://localhost:3000/district",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "police_station",
              label: "Police Station",
              type: "select",
              placeholder: "Select police station",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                dependsOn: "district",
                dependsOnPath:
                  "residential_info.bangladesh_address.company_owned_within_factory.district",
                url: "http://localhost:3000/thana?districtId={parentValue}",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "post_office",
              label: "Post Office",
              type: "text",
              placeholder: "Enter post office",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "post_code",
              label: "Post Code",
              type: "text",
              placeholder: "Enter post code",
              cols: 1,
              validation: {
                required: false,
                maxLength: 20,
              },
            },
            {
              name: "house_flat_road",
              label: "House, Flat/Apartment, Road",
              type: "text",
              placeholder: "Enter address",
              cols: 1,
              validation: {
                required: false,
                maxLength: 200,
              },
            },
            {
              name: "mobile_no",
              label: "Mobile No.",
              type: "phone",
              placeholder: "1X XXX XXXXX",
              cols: 1,
              validation: {
                required: false,
              },
            },
            {
              name: "email",
              label: "Email",
              type: "text",
              placeholder: "Enter email",
              cols: 12,
              validation: {
                required: false,
                email: "Please enter a valid email address",
                maxLength: 100,
              },
            },
          ],
        },

        // Residential Address (Company - Rented)
        {
          title: "Residential Address (Rented by Company)",
          fieldGroup: "residential_info.bangladesh_address.rented_by_company",
          showWhen: {
            field: "accommodation_status_company",
            equals: "rented_by_company",
          },
          clearOnHide: true,
          fields: [
            {
              name: "division",
              label: "Division",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                url: "http://localhost:3000/division",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "district",
              label: "District",
              type: "select",
              placeholder: "Select Division First",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                dependsOn: "division",
                dependsOnPath:
                  "residential_info.bangladesh_address.rented_by_company.division",
                url: "http://localhost:3000/district?divisionId={parentValue}",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "police_station",
              label: "Police Station",
              type: "select",
              placeholder: "Select District First",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                dependsOn: "district",
                dependsOnPath:
                  "residential_info.bangladesh_address.rented_by_company.district",
                url: "http://localhost:3000/thana?districtId={parentValue}",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "post_office",
              label: "Post Office",
              type: "text",
              placeholder: "Post office",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "post_code",
              label: "Post Code",
              type: "text",
              placeholder: "Post Code",
              cols: 1,
              validation: {
                required: false,
                maxLength: 20,
              },
            },
            {
              name: "area",
              label: "Area",
              type: "text",
              placeholder: "Area",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "road",
              label: "Road",
              type: "text",
              placeholder: "Road",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "flat",
              label: "Flat",
              type: "text",
              placeholder: "Flat",
              cols: 1,
              validation: {
                required: false,
                maxLength: 50,
              },
            },
            {
              name: "house",
              label: "House",
              type: "text",
              placeholder: "House",
              cols: 1,
              validation: {
                required: false,
                maxLength: 50,
              },
            },
            {
              name: "mobile",
              label: "Mobile No.",
              type: "phone",
              placeholder: "Mobile No.",
              cols: 1,
              validation: {
                required: false,
              },
            },
            {
              name: "email",
              label: "Email",
              type: "text",
              placeholder: "Email",
              cols: 1,
              validation: {
                required: false,
                email: "Please enter a valid email address",
                maxLength: 100,
              },
            },
            {
              name: "rental_deed_agreement",
              label: "Rental Deed Agreement",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "N.B: Maximum PDF file upload size 2MB",
              validation: {
                required: false,
              },
            },
          ],
        },

        // Residential Address (Outside Factory)
        {
          title: "Address (Outside Factory)",
          fieldGroup:
            "residential_info.bangladesh_address.company_owned_outside_factory",
          showWhen: {
            field: "accommodation_location",
            equals: "outside_factory",
          },
          clearOnHide: true,
          fields: [
            {
              name: "division",
              label: "Division",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              validation: {
                required: true,
              },
              dynamicOptions: {
                url: "http://localhost:3000/division",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "district",
              label: "District",
              type: "select",
              placeholder: "Select Division First",
              cols: 1,
              validation: {
                required: true,
              },
              dynamicOptions: {
                dependsOn: "division",
                dependsOnPath:
                  "residential_info.bangladesh_address.company_owned_outside_factory.division",
                url: "http://localhost:3000/district?divisionId={parentValue}",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "police_station",
              label: "Police Station",
              type: "select",
              placeholder: "Select District First",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                dependsOn: "district",
                dependsOnPath:
                  "residential_info.bangladesh_address.company_owned_outside_factory.district",
                url: "http://localhost:3000/thana?districtId={parentValue}",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "post_office",
              label: "Post Office",
              type: "text",
              placeholder: "Post office",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "post_code",
              label: "Post Code",
              type: "text",
              placeholder: "Post Code",
              cols: 1,
              validation: {
                required: false,
                maxLength: 20,
              },
            },
            {
              name: "area",
              label: "Area",
              type: "text",
              placeholder: "Area",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "road",
              label: "Road",
              type: "text",
              placeholder: "Road",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "flat",
              label: "Flat",
              type: "text",
              placeholder: "Flat",
              cols: 1,
              validation: {
                required: false,
                maxLength: 50,
              },
            },
            {
              name: "house",
              label: "House",
              type: "text",
              placeholder: "House",
              cols: 1,
              validation: {
                required: false,
                maxLength: 50,
              },
            },
            {
              name: "mobile",
              label: "Mobile No.",
              type: "phone",
              placeholder: "Mobile No.",
              cols: 1,
              validation: {
                required: true,
                maxLength: 20,
              },
            },
            {
              name: "email",
              label: "Email",
              type: "text",
              placeholder: "Email",
              cols: 12,
              validation: {
                required: true,
                email: "Please enter a valid email address",
                maxLength: 100,
              },
            },
          ],
        },

        // Current Address (Self Arrangement - Regular)
        {
          title: "Current Address (Regular)",
          fieldGroup:
            "residential_info.bangladesh_address.self_arrangement_regular",
          showWhen: {
            field: "accommodation_status_self",
            equals: "regular",
          },
          clearOnHide: true,
          fields: [
            {
              name: "division",
              label: "Division",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                url: "http://localhost:3000/division",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "district",
              label: "District",
              type: "select",
              placeholder: "Select Division First",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                dependsOn: "division",
                dependsOnPath:
                  "residential_info.bangladesh_address.self_arrangement_regular.division",
                url: "http://localhost:3000/district?divisionId={parentValue}",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "police_station",
              label: "Police Station",
              type: "select",
              placeholder: "Select District First",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                dependsOn: "district",
                dependsOnPath:
                  "residential_info.bangladesh_address.self_arrangement_regular.district",
                url: "http://localhost:3000/thana?districtId={parentValue}",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "post_office",
              label: "Post Office",
              type: "text",
              placeholder: "Post office",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "post_code",
              label: "Post Code",
              type: "text",
              placeholder: "Post Code",
              cols: 1,
              validation: {
                required: false,
                maxLength: 20,
              },
            },
            {
              name: "area",
              label: "Area",
              type: "text",
              placeholder: "Area",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "road",
              label: "Road",
              type: "text",
              placeholder: "Road",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "flat",
              label: "Flat",
              type: "text",
              placeholder: "Flat",
              cols: 1,
              validation: {
                required: false,
                maxLength: 50,
              },
            },
            {
              name: "house",
              label: "House",
              type: "text",
              placeholder: "House",
              cols: 1,
              validation: {
                required: false,
                maxLength: 50,
              },
            },
            {
              name: "mobile",
              label: "Mobile No.",
              type: "phone",
              placeholder: "Mobile No.",
              cols: 1,
              validation: {
                required: false,
              },
            },
            {
              name: "email",
              label: "Email",
              type: "text",
              placeholder: "email",
              cols: 1,
              validation: {
                required: false,
                email: "Please enter a valid email address",
                maxLength: 100,
              },
            },
            {
              name: "rental_deed_agreement",
              label: "Rental Deed Agreement",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "N.B: Maximum PDF file upload size 2MB",
              validation: {
                required: false,
              },
            },
          ],
        },

        // Temporary Address (Self Arrangement - Temporary)
        {
          title: "Temporary Address",
          fieldGroup:
            "residential_info.bangladesh_address.self_arrangement_temporary",
          showWhen: {
            field: "accommodation_status_self",
            equals: "temporary",
          },
          clearOnHide: true,
          fields: [
            {
              name: "division",
              label: "Division",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                url: "http://localhost:3000/division",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "district",
              label: "District",
              type: "select",
              placeholder: "Select Division First",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                dependsOn: "division",
                dependsOnPath:
                  "residential_info.bangladesh_address.self_arrangement_temporary.division",
                url: "http://localhost:3000/district?divisionId={parentValue}",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "police_station",
              label: "Police Station",
              type: "select",
              placeholder: "Select District First",
              cols: 1,
              validation: {
                required: false,
              },
              dynamicOptions: {
                dependsOn: "district",
                dependsOnPath:
                  "residential_info.bangladesh_address.self_arrangement_temporary.district",
                url: "http://localhost:3000/thana?districtId={parentValue}",
                transform: (data) =>
                  data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  })),
              },
            },
            {
              name: "post_office",
              label: "Post Office",
              type: "text",
              placeholder: "Post office",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "post_code",
              label: "Post Code",
              type: "text",
              placeholder: "Post Code",
              cols: 1,
              validation: {
                required: false,
                maxLength: 20,
              },
            },
            {
              name: "area",
              label: "Area",
              type: "text",
              placeholder: "Area",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "road",
              label: "Road",
              type: "text",
              placeholder: "Road",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "flat",
              label: "Flat",
              type: "text",
              placeholder: "Flat",
              cols: 1,
              validation: {
                required: false,
                maxLength: 50,
              },
            },
            {
              name: "house",
              label: "House",
              type: "text",
              placeholder: "House",
              cols: 1,
              validation: {
                required: false,
                maxLength: 50,
              },
            },
            {
              name: "mobile",
              label: "Mobile No.",
              type: "phone",
              placeholder: "Mobile No.",
              cols: 1,
              validation: {
                required: false,
              },
            },
            {
              name: "email",
              label: "Email",
              type: "text",
              placeholder: "Email",
              cols: 1,
              validation: {
                required: false,
                email: "Please enter a valid email address",
                maxLength: 100,
              },
            },
            {
              name: "rental_deed_agreement",
              label: "Rental Deed Agreement",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "N.B: Maximum PDF file upload size 2MB",
              validation: {
                required: false,
              },
            },
            {
              name: "expected_date_for_regular_residence",
              label: "Expected Date for Regular Residence",
              type: "date",
              placeholder: "dd-mm-yyyy",
              cols: 1,
              validation: {
                required: false,
              },
            },
          ],
        },
      ],
    },

    // ==================== STEP 5: Previous Passport Details ====================
    {
      title: "Previous Passport Details",
      description: "Information about previous passports",
      sections: [
        {
          title: "Previous Passport Information",
          fieldGroup: "previous_passport_details",
          fields: [
            {
              name: "have_any_previous_passport",
              label: "Do you have any previous passports?",
              type: "radio",
              cols: 12,
              validation: {
                required: false,
              },
              options: [
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ],
            },
          ],
        },
        {
          title: "Previous Passport Details",
          fieldGroup: "previous_passport_details.previous_passport_info_if_yes",
          repeatable: true,
          showWhen: {
            field: "previous_passport_details.have_any_previous_passport",
            equals: "Yes",
          },
          fields: [
            {
              name: "passport_no",
              label: "Passport No.",
              type: "text",
              placeholder: "Passport No.",
              cols: 1,
              validation: {
                required: true,
                maxLength: 50,
              },
            },
            {
              name: "personal_no",
              label: "Personal No.",
              type: "text",
              placeholder: "Personal No.",
              cols: 1,
              validation: {
                required: true,
                maxLength: 50,
              },
            },
            {
              name: "nationality",
              label: "Nationality",
              type: "select",
              placeholder: "Select one",
              cols: 1,
              validation: {
                required: true,
              },
              options: [
                { value: "", label: "Select one" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "issuing_authority",
              label: "Issuing Authority",
              type: "text",
              placeholder: "Issuing Authority",
              cols: 1,
              validation: {
                required: true,
                maxLength: 100,
              },
            },
          ],
        },
      ],
    },

    // ==================== STEP 6: Attachments ====================
    {
      title: "Attachments",
      description: "Upload necessary documents (Only PDF files)",
      sections: [
        {
          title: "Necessary documents to be attached here (Only PDF file)",
          fields: [
            {
              name: "attachment_1",
              label:
                "Passport of the Employee/Expatriate/Investor/ (Whole of the used part)",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "Each File Max. size 2MB",
              validation: {
                required: false,
              },
            },
            {
              name: "attachment_2",
              label:
                "Appointment Letter/transfer order/service contract or agreement for expatriate/investors.",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "Each File Max. size 2MB",
              validation: {
                required: false,
              },
            },
            {
              name: "attachment_3",
              label:
                "Copies of curriculum vitae (CV), All academic qualification & professional experience certificate for the employee",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "Each File Max. size 2MB",
              validation: {
                required: false,
              },
            },
            {
              name: "attachment_4",
              label: "Up to date Trade License",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "Each File Max. size 2MB",
              validation: {
                required: false,
              },
            },
            {
              name: "attachment_5",
              label:
                "Up-to-date Income tax clearance certificate (Organization)",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "Each File Max. size 2MB",
              validation: {
                required: false,
              },
            },
            {
              name: "attachment_6",
              label:
                "Specific activities of the organization (On company letterhead)",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "Each File Max. size 2MB",
              validation: {
                required: false,
              },
            },
            {
              name: "attachment_7",
              label:
                "Statement of the manpower showing list of local & expatriate personnel employed with designation, salary break-up, nationality and date of first appointment",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "Each File Max. size 2MB",
              validation: {
                required: false,
              },
            },
            {
              name: "attachment_8",
              label:
                "Copy of work permit (if the foreigner was previously employed in Bangladesh, along with proof of work permit cancellation)",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "Each File Max. size 2MB",
              validation: {
                required: false,
              },
            },
            {
              name: "attachment_9",
              label:
                "Encashment certificate of inward remittance of minimum U.S-$50,000.00 as initial establishment cost for branch/liaison/representative office and locally incorporated/ joint venture and 100% Foreign ownership companies. (applicable for investors)",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "Each File Max. size 2MB",
              validation: {
                required: false,
              },
            },
            {
              name: "attachment_10",
              label: "Attachment of company's comments as per remarks (if any)",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "Each File Max. size 2MB",
              validation: {
                required: false,
              },
            },
            {
              name: "attachment_11",
              label: "Others necessary documents (please attach if any)",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: ".pdf",
              uploadSourceId: "document-upload",
              helpText: "Each File Max. size 2MB",
              validation: {
                required: false,
              },
            },
          ],
        },
        {
          title: "Important Notes",
          fields: [
            {
              name: "attestation_note",
              label: "",
              type: "text",
              defaultValue:
                "N.B - All documents shall have to be attested by the Chairman/ CEO / Managing director/ Country Manager/ Chief executive of the Company/ firms.",
              cols: 12,
              disabled: true,
            },
            {
              name: "authorization_note",
              label: "",
              type: "text",
              defaultValue:
                "Document's must be submitted by an authorized person of the organization including the letter of authorization.",
              cols: 12,
              disabled: true,
            },
          ],
        },
      ],
    },

    // ==================== STEP 7: Declarations ====================
    {
      title: "Declaration and Undertaking",
      description: "Authorized person details and declaration",
      sections: [
        {
          title: "Authorized Person of the Organization",
          fields: [
            {
              name: "authorized_full_name",
              label: "Full Name",
              type: "text",
              placeholder: "Enter full name",
              cols: 1,
              validation: {
                required: false,
              },
            },
            {
              name: "authorized_designation",
              label: "Designation",
              type: "text",
              placeholder: "Enter designation",
              cols: 1,
              validation: {
                required: false,
              },
            },
            {
              name: "authorized_mobile_no",
              label: "Mobile No.",
              type: "phone",
              placeholder: "Mobile No.",
              cols: 1,
              validation: {
                required: false,
              },
            },
            {
              name: "authorized_email",
              label: "Email address",
              type: "text",
              placeholder: "Enter email address",
              cols: 1,
              validation: {
                required: false,
                email: "Please enter a valid email address",
                maxLength: 100,
              },
            },
            {
              name: "authorized_picture",
              label: "Picture",
              type: "file",
              placeholder: "Choose file",
              cols: 12,
              accept: "image/*",
              uploadSourceId: "image-upload",
              helpText: "Maximum file size 2MB",
              validation: {
                required: false,
              },
            },
            {
              name: "declaration_checkbox",
              label:
                "I do here by declare that the information given above is true to the best of my knowledge and I shall be liable for any false information/ statement is given.",
              type: "checkbox",
              cols: 12,
              validation: {
                required: false,
              },
            },
          ],
        },
      ],
    },
  ],
};
