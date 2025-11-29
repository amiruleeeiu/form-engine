import type { FormSchema } from "../form-engine/types/index.js";

/**
 * Business Registration Form Schema
 *
 * এটি একটি সম্পূর্ণ Business Registration form যেখানে আছে:
 * - Stepper-based multi-step form (6 steps)
 * - Repeatable sections (Subscriber Info)
 * - Multiple sections per step
 * - Field-level validation
 * - Various field types
 *
 * Based on Banglabiz wizard template v1
 */

export const businessRegistrationSchema: FormSchema = {
  steps: [
    // ==================== STEP 1: General & Office ====================
    {
      title: "General & Office",
      description: "General Information and Office Address",
      sections: [
        {
          title: "General Information",
          description: "",
          fields: [
            {
              name: "company_name",
              label: "Company Name",
              type: "text",
              placeholder: "Enter company name",
              cols: 1, // half width
              validation: {
                required: "Company name is required",
                minLength: {
                  value: 2,
                  message: "Company name must be at least 2 characters",
                },
              },
            },
            {
              name: "entity_type",
              label: "Entity Type",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              options: [
                { label: "Proprietorship", value: "proprietorship" },
                { label: "Partnership", value: "partnership" },
                { label: "Private Limited Company", value: "private_limited" },
                { label: "Public Limited Company", value: "public_limited" },
                { label: "One Person Company", value: "one_person_company" },
              ],
              validation: {
                required: "Entity type is required",
              },
            },
            {
              name: "main_business_objective",
              label: "Main Business Objective",
              type: "text",
              placeholder: "Enter main business objective",
              cols: 1,
              validation: {
                required: "Main business objective is required",
              },
            },
            {
              name: "business_sector",
              label: "Business Sector",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              options: [
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
              ],
              validation: {
                required: "Business sector is required",
              },
            },
            {
              name: "business_sub_sector",
              label: "Business Sub-Sector",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              options: [
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
              ],
              validation: {
                required: "Business sub-sector is required",
              },
            },
            {
              name: "entity_email",
              label: "Entity Email Address",
              type: "text",
              placeholder: "Enter email address",
              cols: 1,
              validation: {
                required: "Email is required",
                email: "Please enter a valid email address",
              },
            },
          ],
        },
        {
          title: "Office Address",
          description: "",
          fields: [
            {
              name: "office_address",
              label: "Office Address",
              type: "text",
              placeholder: "Enter office address",
              cols: 2, // full width
              validation: {
                required: "Office address is required",
              },
            },
            {
              name: "zone_circle",
              label: "Zone / Circle",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              options: [
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
              ],
              validation: {
                required: "Zone/Circle is required",
              },
            },
            {
              name: "ward",
              label: "Ward",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              options: [
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
              ],
              validation: {
                required: "Ward is required",
              },
            },
            {
              name: "sector_section",
              label: "Sector/Section",
              type: "text",
              placeholder: "Enter sector/section",
              cols: 1,
              validation: {
                required: "Sector/Section is required",
              },
            },
            {
              name: "area_block",
              label: "Area/Block",
              type: "text",
              placeholder: "Enter area/block",
              cols: 1,
              validation: {
                required: "Area/Block is required",
              },
            },
            {
              name: "road",
              label: "Road",
              type: "text",
              placeholder: "Enter road",
              cols: 1,
              validation: {
                required: "Road is required",
              },
            },
            {
              name: "place_of_business",
              label: "Place of Business (Rent/Own)",
              type: "radio",
              cols: 1,
              options: [
                { label: "Rent", value: "rent" },
                { label: "Own", value: "own" },
              ],
              validation: {
                required: "Place of business is required",
              },
            },
            {
              name: "sign_board_sqft",
              label: "Sign Board Sq. ft.",
              type: "number",
              placeholder: "Enter sign board size",
              cols: 2,
              validation: {
                required: "Sign board size is required",
                min: { value: 0, message: "Must be a positive number" },
              },
            },
          ],
        },
      ],
    },

    // ==================== STEP 2: Capital & Share ====================
    {
      title: "Capital & Share",
      description: "Capital and Share Information",
      fields: [
        {
          name: "number_of_share",
          label: "Number of Shares",
          type: "number",
          placeholder: "Enter number of shares",
          cols: 1,
          validation: {
            required: "Number of shares is required",
            min: { value: 1, message: "Must be at least 1" },
          },
        },
        {
          name: "number_of_qualification_share",
          label: "Number of Qualification Shares",
          type: "number",
          placeholder: "Enter qualification shares",
          cols: 1,
          validation: {
            required: "Qualification shares required",
            min: { value: 0 },
          },
        },
        {
          name: "minimum_number_of_director",
          label: "Minimum no. of Directors",
          type: "number",
          placeholder: "Enter minimum directors",
          cols: 1,
          validation: {
            required: "Minimum directors required",
            min: { value: 1 },
          },
        },
        {
          name: "maximum_number_of_director",
          label: "Maximum no. of Directors",
          type: "number",
          placeholder: "Enter maximum directors",
          cols: 1,
          validation: {
            required: "Maximum directors required",
            min: { value: 1 },
          },
        },
        {
          name: "quorum_of_agm_egm",
          label: "Quorum of AGM/EGM",
          type: "number",
          placeholder: "Enter quorum",
          cols: 1,
          validation: {
            required: "Quorum is required",
            min: { value: 1 },
          },
        },
        {
          name: "quorum_of_board_of_director_meeting",
          label: "Quorum of Board of Directors Meeting",
          type: "number",
          placeholder: "Enter quorum",
          cols: 1,
          validation: {
            required: "Board quorum is required",
            min: { value: 1 },
          },
        },
        {
          name: "duration_for_chairmanship",
          label: "Duration for Chairmanship (year)",
          type: "number",
          placeholder: "Enter years",
          cols: 1,
          validation: {
            required: "Duration is required",
            min: { value: 1 },
            max: { value: 50 },
          },
        },
        {
          name: "duration_for_md",
          label: "Duration for Managing Directorship (year)",
          type: "number",
          placeholder: "Enter years",
          cols: 1,
          validation: {
            required: "Duration is required",
            min: { value: 1 },
            max: { value: 50 },
          },
        },
      ],
    },

    // ==================== STEP 3: Subscriber Info ====================
    {
      title: "Subscriber Info",
      description: "Add subscriber information (you can add multiple)",
      sections: [
        {
          title: "Subscriber Info",
          description: "Add subscriber/director information",
          repeatable: true,
          repeatableConfig: {
            addButtonText: "➕ Add New Subscriber Info",
            removeButtonText: "Remove",
            initialItems: 1,
            minItems: 1,
            maxItems: 10,
          },
          fields: [
            {
              name: "director_name",
              label: "Name",
              type: "text",
              placeholder: "Enter name",
              cols: 1,
              validation: {
                required: "Name is required",
                minLength: { value: 2 },
              },
            },
            {
              name: "director_position",
              label: "Position",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              options: [
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
              ],
              validation: {
                required: "Position is required",
              },
            },
            {
              name: "number_of_subscriber_share",
              label: "Number of Subscribed Shares",
              type: "number",
              placeholder: "Enter shares",
              cols: 1,
              validation: {
                required: "Shares required",
                min: { value: 1 },
              },
            },
            {
              name: "director_nationality",
              label: "Nationality",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              options: [
                { label: "Bangladeshi", value: "bangladeshi" },
                { label: "Other", value: "other" },
              ],
              validation: {
                required: "Nationality is required",
              },
            },
            {
              name: "director_nid_passport",
              label: "National ID/Passport Number",
              type: "text",
              placeholder: "Enter NID/Passport",
              cols: 1,
              validation: {
                required: "NID/Passport is required",
              },
            },
            {
              name: "director_tin",
              label: "TIN",
              type: "text",
              placeholder: "Enter TIN",
              cols: 1,
              validation: {
                required: "TIN is required",
              },
            },
            {
              name: "director_father_name",
              label: "Father's Name",
              type: "text",
              placeholder: "Enter father's name",
              cols: 1,
              validation: {
                required: "Father's name is required",
              },
            },
            {
              name: "director_mother_name",
              label: "Mother's Name",
              type: "text",
              placeholder: "Enter mother's name",
              cols: 1,
              validation: {
                required: "Mother's name is required",
              },
            },
            {
              name: "director_current_address",
              label: "Current Address",
              type: "text",
              placeholder: "Enter current address",
              cols: 1,
              validation: {
                required: "Current address is required",
              },
            },
            {
              name: "director_current_district",
              label: "District of Current Address",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              options: [
                { label: "Dhaka", value: "dhaka" },
                { label: "Chittagong", value: "chittagong" },
                { label: "Sylhet", value: "sylhet" },
              ],
              validation: {
                required: "District is required",
              },
            },
            {
              name: "director_permanent_address",
              label: "Permanent Address",
              type: "text",
              placeholder: "Enter permanent address",
              cols: 1,
              validation: {
                required: "Permanent address is required",
              },
            },
            {
              name: "director_permanent_district",
              label: "District of Permanent Address",
              type: "select",
              placeholder: "Select One",
              cols: 1,
              options: [
                { label: "Dhaka", value: "dhaka" },
                { label: "Chittagong", value: "chittagong" },
                { label: "Sylhet", value: "sylhet" },
              ],
              validation: {
                required: "District is required",
              },
            },
            {
              name: "director_email",
              label: "Email",
              type: "text",
              placeholder: "Enter email",
              cols: 1,
              validation: {
                required: "Email is required",
                email: "Invalid email address",
              },
            },
            {
              name: "director_dob",
              label: "Date of Birth",
              type: "date",
              placeholder: "Select date",
              cols: 1,
              validation: {
                required: "Date of birth is required",
              },
            },
          ],
        },
      ],
    },

    // ==================== STEP 4: Witness Info ====================
    {
      title: "Witness Info",
      description: "Witness Information",
      sections: [
        {
          title: "Witness Info - Witness 1",
          description: "",
          fields: [
            {
              name: "witness1_name",
              label: "Name",
              type: "text",
              placeholder: "Enter name",
              cols: 1,
              validation: {
                required: "Name is required",
              },
            },
            {
              name: "witness1_address",
              label: "Address",
              type: "text",
              placeholder: "Enter address",
              cols: 1,
              validation: {
                required: "Address is required",
              },
            },
            {
              name: "witness1_phone",
              label: "Phone",
              type: "text",
              placeholder: "Enter phone number",
              cols: 1,
              validation: {
                required: "Phone is required",
                pattern: {
                  value: /^[0-9]{11}$/,
                  message: "Phone must be 11 digits",
                },
              },
            },
            {
              name: "witness1_nid",
              label: "NID",
              type: "text",
              placeholder: "Enter NID",
              cols: 1,
              validation: {
                required: "NID is required",
              },
            },
          ],
        },
        {
          title: "Witness Info - Witness 2",
          description: "",
          fields: [
            {
              name: "witness2_name",
              label: "Name",
              type: "text",
              placeholder: "Enter name",
              cols: 1,
              validation: {
                required: "Name is required",
              },
            },
            {
              name: "witness2_address",
              label: "Address",
              type: "text",
              placeholder: "Enter address",
              cols: 1,
              validation: {
                required: "Address is required",
              },
            },
            {
              name: "witness2_phone",
              label: "Phone",
              type: "text",
              placeholder: "Enter phone number",
              cols: 1,
              validation: {
                required: "Phone is required",
                pattern: {
                  value: /^[0-9]{11}$/,
                  message: "Phone must be 11 digits",
                },
              },
            },
            {
              name: "witness2_nid",
              label: "NID",
              type: "text",
              placeholder: "Enter NID",
              cols: 1,
              validation: {
                required: "NID is required",
              },
            },
          ],
        },
      ],
    },

    // ==================== STEP 5: Applicant Info ====================
    {
      title: "Applicant Info",
      description: "Applicant Information",
      fields: [
        {
          name: "applicant_name",
          label: "Name",
          type: "text",
          placeholder: "Enter name",
          cols: 1,
          validation: {
            required: "Name is required",
          },
        },
        {
          name: "position",
          label: "Position",
          type: "select",
          placeholder: "Select One",
          cols: 1,
          options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ],
          validation: {
            required: "Position is required",
          },
        },
        {
          name: "applicant_current_address",
          label: "Current Address",
          type: "text",
          placeholder: "Enter current address",
          cols: 1,
          validation: {
            required: "Current address is required",
          },
        },
        {
          name: "district",
          label: "District of Current Address",
          type: "select",
          placeholder: "Select One",
          cols: 1,
          options: [
            { label: "Dhaka", value: "dhaka" },
            { label: "Chittagong", value: "chittagong" },
          ],
          validation: {
            required: "District is required",
          },
        },
        {
          name: "father_name",
          label: "Father's Name",
          type: "text",
          placeholder: "Enter father's name",
          cols: 1,
          validation: {
            required: "Father's name is required",
          },
        },
        {
          name: "mother_name",
          label: "Mother's Name",
          type: "text",
          placeholder: "Enter mother's name",
          cols: 1,
          validation: {
            required: "Mother's name is required",
          },
        },
        {
          name: "permanent_address",
          label: "Permanent Address",
          type: "text",
          placeholder: "Enter permanent address",
          cols: 2, // full width
          validation: {
            required: "Permanent address is required",
          },
        },
      ],
    },

    // ==================== STEP 6: Declared by ====================
    {
      title: "Declared by",
      description: "Declaration Information",
      fields: [
        {
          name: "declarant_name",
          label: "Name",
          type: "text",
          placeholder: "Enter name",
          cols: 1,
          validation: {
            required: "Name is required",
          },
        },
        {
          name: "declarant_position",
          label: "Position",
          type: "select",
          placeholder: "Select One",
          cols: 1,
          options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ],
          validation: {
            required: "Position is required",
          },
        },
        {
          name: "company_name_declarant",
          label: "Organization (applicable for advocate only)",
          type: "text",
          placeholder: "Enter organization name",
          cols: 1,
        },
        {
          name: "address_declarant",
          label: "Address",
          type: "text",
          placeholder: "Enter address",
          cols: 1,
          validation: {
            required: "Address is required",
          },
        },
      ],
    },
  ],
};
