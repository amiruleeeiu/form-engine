import type { FormSchema } from "../form-engine/types/index.js";

export const userProfileSchema: FormSchema = {
  // Centralized upload configuration
  uploadSources: [
    {
      id: "profile-image-upload",
      url: "http://localhost:3000/api/upload",
      method: "POST",
      fieldName: "file",
      transform: (response) => response.file?.path || response.url,
    },
  ],
  sections: [
    {
      title: "User Profile",
      description:
        "Create your user profile with profile picture and secure password",
      fields: [
        {
          type: "text",
          name: "username",
          label: "Username",
          placeholder: "Enter your username",
          cols: 6,
          validation: {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
            maxLength: {
              value: 20,
              message: "Username must be at most 20 characters",
            },
          },
        },
        {
          type: "text",
          name: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          cols: 6,
          validation: {
            required: "Email is required",
            email: "Please enter a valid email address",
          },
        },
        {
          type: "profilePicture",
          name: "profilePicture",
          label: "Profile Picture",
          cols: 12,
          maxSize: 5 * 1024 * 1024, // 5MB
          uploadSourceId: "profile-image-upload", // Use centralized upload source
          // Alternative: Inline upload configuration (if you don't want to use uploadSources)
          // uploadConfig: {
          //   url: "http://localhost:3000/api/upload",
          //   transform: (response) => response.file.path,
          // },
          validation: {
            required: "Profile picture is required",
          },
        },
        {
          type: "password",
          name: "password",
          label: "Password",
          placeholder: "Enter your password",
          cols: 6,
          showToggle: true,
          validation: {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
              message:
                "Password must contain uppercase, lowercase, number and special character",
            },
          },
        },
        {
          type: "password",
          name: "confirmPassword",
          label: "Confirm Password",
          placeholder: "Re-enter your password",
          cols: 6,
          showToggle: true,
          validation: {
            required: "Please confirm your password",
            validate: (value: string, formValues: Record<string, unknown>) =>
              value === formValues.password || "Passwords do not match",
          },
        },
        {
          type: "text",
          name: "firstName",
          label: "First Name",
          placeholder: "Enter your first name",
          cols: 6,
          validation: {
            required: "First name is required",
          },
        },
        {
          type: "text",
          name: "lastName",
          label: "Last Name",
          placeholder: "Enter your last name",
          cols: 6,
          validation: {
            required: "Last name is required",
          },
        },
        {
          type: "phone",
          name: "phoneNumber",
          label: "Phone Number",
          placeholder: "Enter your phone number",
          cols: 6,
          defaultCountry: "US",
          validation: {
            required: "Phone number is required",
          },
        },
        {
          type: "date",
          name: "dateOfBirth",
          label: "Date of Birth",
          cols: 6,
          validation: {
            required: "Date of birth is required",
          },
        },
        {
          type: "select",
          name: "country",
          label: "Country",
          placeholder: "Select or type your country",
          cols: 6,
          options: [
            { label: "United States", value: "US" },
            { label: "Canada", value: "CA" },
            { label: "United Kingdom", value: "GB" },
            { label: "Australia", value: "AU" },
            { label: "Germany", value: "DE" },
            { label: "France", value: "FR" },
            { label: "Japan", value: "JP" },
            { label: "China", value: "CN" },
            { label: "India", value: "IN" },
            { label: "Brazil", value: "BR" },
          ],
          validation: {
            required: "Country is required",
          },
        },
        {
          type: "textarea",
          name: "bio",
          label: "Bio",
          placeholder: "Tell us about yourself",
          cols: 12,
          rows: 4,
          validation: {
            maxLength: {
              value: 500,
              message: "Bio must be at most 500 characters",
            },
          },
        },
        {
          type: "checkbox",
          name: "agreeToTerms",
          label: "Terms and Conditions",
          checkboxLabel: "I agree to the terms and conditions",
          cols: 12,
          validation: {
            required: "You must agree to the terms and conditions",
          },
        },
      ],
    },
  ],
};
