import type { FormSchema } from "../form-engine/types/index.js";

/**
 * Security Clearance Application Form
 *
 * This is a comprehensive security clearance form with:
 * - 7 steps with multiple sections
 * - Complex conditional logic for address sections
 * - Repeatable passport details section
 * - Multiple file uploads with centralized upload configuration
 * - Various field types and validations
 */

export const securityClearanceSchema: FormSchema = {
  title: "Application for Security Clearance",
  description: "Application for security clearance (SC)",

  // Centralized file upload configuration
  // Configure these upload sources to enable automatic file uploads to your API
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
        // Extract file URL from API response
        // Adjust this based on your API response structure
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
    // ==================== STEP 1: Basic Instructions ====================
    {
      title: "Basic Instructions",
      description: "Work permit reference information",
      sections: [
        {
          title: "Basic Instructions",
          fields: [
            {
              name: "work_permit_reference_no",
              label: "Please give your approved work permit reference No.",
              type: "text",
              placeholder: "Enter work permit reference number",
              cols: 12,
              validation: {
                required: false,
              },
            },
          ],
        },
      ],
    },

    // ==================== STEP 2: Bank Details ====================
    {
      title: "Bank Details",
      description: "Expatriate/Employee banking information",
      sections: [
        {
          title: "Expatriate/Employee Bank Details",
          fields: [
            {
              name: "account_holder_name",
              label: "Account Holder Name",
              type: "text",
              placeholder: "Enter account holder name",
              cols: 1,
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
            },
            {
              name: "branch_name",
              label: "Branch name",
              type: "text",
              placeholder: "Enter branch name",
              cols: 1,
            },
            {
              name: "bank_account_number",
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
          fields: [
            {
              name: "tin_number",
              label: "TIN Number",
              type: "text",
              placeholder: "Enter TIN number",
              cols: 12,
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
          fields: [
            {
              name: "abroad_country",
              label: "Country",
              type: "select",
              placeholder: "Select country",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select one" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "abroad_state",
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
              name: "abroad_city",
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
              name: "abroad_postal_code",
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
              name: "abroad_street_address",
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
          showWhen: {
            field: "accommodation_location",
            equals: "within_factory",
          },
          fields: [
            {
              name: "bd_district",
              label: "District",
              type: "select",
              placeholder: "Select district",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select one" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "bd_police_station",
              label: "Police Station",
              type: "select",
              placeholder: "Select police station",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select one" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "bd_post_office",
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
              name: "bd_post_code",
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
              name: "bd_house_address",
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
              name: "bd_mobile_no",
              label: "Mobile No.",
              type: "phone",
              placeholder: "1X XXX XXXXX",
              cols: 1,
              validation: {
                required: false,
                pattern: "^[0-9]{10}$",
              },
            },
            {
              name: "bd_email",
              label: "Email",
              type: "text",
              placeholder: "Enter email",
              cols: 12,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
          ],
        },

        // Residential Address (Company - Rented)
        {
          title: "Residential Address (Rented by Company)",
          showWhen: {
            field: "accommodation_status_company",
            equals: "rented_by_company",
          },
          fields: [
            {
              name: "division_company",
              label: "Division",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select One" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "district_company",
              label: "District",
              type: "select",
              placeholder: "Select Division First",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select Division First" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "police_station_company",
              label: "Police Station",
              type: "select",
              placeholder: "Select District First",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select District First" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "post_office_company",
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
              name: "post_code_company",
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
              name: "area_company",
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
              name: "road_company",
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
              name: "flat_company",
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
              name: "house_company",
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
              name: "mobile_no_company",
              label: "Mobile No.",
              type: "phone",
              placeholder: "Mobile No.",
              cols: 1,
              validation: {
                required: false,
                pattern: "^[0-9]{10}$",
              },
            },
            {
              name: "email_company",
              label: "Email",
              type: "text",
              placeholder: "Email",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "rental_deed_company",
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
          showWhen: {
            field: "accommodation_location",
            equals: "outside_factory",
          },
          fields: [
            {
              name: "division_outside_factory",
              label: "Division",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select One" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "district_outside_factory",
              label: "District",
              type: "select",
              placeholder: "Select Division First",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select Division First" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "police_station_outside_factory",
              label: "Police Station",
              type: "select",
              placeholder: "Select District First",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select District First" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "post_office_outside_factory",
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
              name: "post_code_outside_factory",
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
              name: "area_outside_factory",
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
              name: "road_outside_factory",
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
              name: "flat_outside_factory",
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
              name: "house_outside_factory",
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
              name: "mobile_no_outside_factory",
              label: "Mobile No.",
              type: "phone",
              placeholder: "Mobile No.",
              cols: 1,
              validation: {
                required: false,
                maxLength: 20,
              },
            },
            {
              name: "email_outside_factory",
              label: "Email",
              type: "text",
              placeholder: "Email",
              cols: 12,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
          ],
        },

        // Current Address (Self Arrangement - Regular)
        {
          title: "Current Address (Regular)",
          showWhen: {
            field: "accommodation_status_self",
            equals: "regular",
          },
          fields: [
            {
              name: "division_regular",
              label: "Division",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select One" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "district_regular",
              label: "District",
              type: "select",
              placeholder: "Select Division First",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select Division First" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "police_station_regular",
              label: "Police Station",
              type: "select",
              placeholder: "Select District First",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select District First" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "post_office_regular",
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
              name: "post_code_regular",
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
              name: "area_regular",
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
              name: "road_regular",
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
              name: "flat_regular",
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
              name: "house_regular",
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
              name: "mobile_no_regular",
              label: "Mobile No.",
              type: "phone",
              placeholder: "Mobile No.",
              cols: 1,
              validation: {
                required: false,
                pattern: "^[0-9]{10}$",
              },
            },
            {
              name: "email_regular",
              label: "Email",
              type: "text",
              placeholder: "email",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "rental_deed_regular",
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
          showWhen: {
            field: "accommodation_status_self",
            equals: "temporary",
          },
          fields: [
            {
              name: "division_temporary",
              label: "Division",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select One" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "district_temporary",
              label: "District",
              type: "select",
              placeholder: "Select Division First",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select Division First" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "police_station_temporary",
              label: "Police Station",
              type: "select",
              placeholder: "Select District First",
              cols: 1,
              validation: {
                required: false,
              },
              options: [
                { value: "", label: "Select District First" },
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
            {
              name: "post_office_temporary",
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
              name: "post_code_temporary",
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
              name: "area_temporary",
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
              name: "road_temporary",
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
              name: "flat_temporary",
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
              name: "house_temporary",
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
              name: "mobile_no_temporary",
              label: "Mobile No.",
              type: "phone",
              placeholder: "Mobile No.",
              cols: 1,
              validation: {
                required: false,
                pattern: "^[0-9]{10}$",
              },
            },
            {
              name: "email_temporary",
              label: "Email",
              type: "text",
              placeholder: "Email",
              cols: 1,
              validation: {
                required: false,
                maxLength: 100,
              },
            },
            {
              name: "rental_deed_temporary",
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
              name: "expected_date_regular",
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
          fields: [
            {
              name: "has_previous_passport",
              label: "Do you have any previous passports?",
              type: "radio",
              cols: 12,
              validation: {
                required: false,
              },
              options: [
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ],
            },
          ],
        },
        {
          title: "Previous Passport Details",
          repeatable: true,
          showWhen: {
            field: "has_previous_passport",
            equals: "yes",
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
                pattern: "^[0-9]{10}$",
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
