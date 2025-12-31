import type { FormSchema } from "../form-engine/types/index.js";

/**
 * Dropzone File Upload Example
 *
 * Demonstrates drag & drop file upload using the Dropzone field.
 * Features:
 * - Drag and drop support
 * - Multiple file uploads
 * - File size validation
 * - File type restrictions
 * - Upload progress indication
 * - Uploaded files list with remove option
 */

export const dropzoneExampleSchema: FormSchema = {
  // Upload sources configuration
  uploadSources: [
    {
      id: "document-upload",
      url: "http://localhost:3000/api/upload",
      method: "POST",
      fieldName: "file",
      additionalData: {
        folder: "documents",
      },
      transform: (response) => response.file?.path || response.url,
    },
    {
      id: "image-upload",
      url: "http://localhost:3000/api/upload",
      method: "POST",
      fieldName: "file",
      additionalData: {
        folder: "images",
      },
      transform: (response) => response.file?.path || response.url,
    },
  ],

  sections: [
    {
      title: "Simple File Upload",
      description: "Traditional file upload with browse button",
      fields: [
        {
          name: "simple_document",
          label: "Upload Document (Simple)",
          type: "file",
          accept: ".pdf,.doc,.docx",
          uploadSourceId: "document-upload",
          cols: 12,
          helpText: "Traditional file upload - click to browse",
        },
        {
          name: "simple_image",
          label: "Upload Image (Simple)",
          type: "file",
          accept: "image/*",
          uploadSourceId: "image-upload",
          cols: 12,
          helpText: "Click to select an image file",
        },
      ],
    },
    {
      title: "Drag & Drop Dropzone",
      description: "Modern drag & drop file upload with visual feedback",
      fields: [
        {
          name: "dropzone_single_document",
          label: "Upload Document (Dropzone - Single)",
          type: "dropzone",
          accept: ".pdf,.doc,.docx",
          uploadSourceId: "document-upload",
          maxSize: 5 * 1024 * 1024, // 5MB
          cols: 12,
          helpText: "Drag & drop or click to upload a document",
          validation: {
            required: "Please upload a document",
          },
        },
        {
          name: "dropzone_multiple_images",
          label: "Upload Images (Dropzone - Multiple)",
          type: "dropzone",
          accept: "image/*",
          uploadSourceId: "image-upload",
          multiple: true,
          maxSize: 2 * 1024 * 1024, // 2MB per file
          maxFiles: 5,
          cols: 12,
          helpText: "Drag & drop up to 5 images (max 2MB each)",
        },
        {
          name: "dropzone_any_file",
          label: "Upload Any File (Dropzone)",
          type: "dropzone",
          uploadSourceId: "document-upload",
          maxSize: 10 * 1024 * 1024, // 10MB
          cols: 12,
          helpText: "Any file type accepted (max 10MB)",
        },
      ],
    },
    {
      title: "Profile Picture Upload",
      description: "Special profile picture field with circular preview",
      fields: [
        {
          name: "profile_picture",
          label: "Profile Picture",
          type: "profilePicture",
          accept: "image/*",
          uploadSourceId: "image-upload",
          maxSize: 2 * 1024 * 1024, // 2MB
          cols: 12,
          validation: {
            required: "Profile picture is required",
          },
        },
      ],
    },
  ],
};
