# File Upload Configuration Guide

এই গাইডে দেখানো হবে কিভাবে centralized file upload configuration ব্যবহার করবেন।

## ১. Upload Sources Configuration

Form schema-তে একবার upload sources define করুন:

```typescript
import type { FormSchema } from "./form-engine/types/index.js";

export const myFormSchema: FormSchema = {
  title: "Application Form",

  // Upload sources - একবার define করুন
  uploadSources: [
    {
      id: "document-upload", // Unique ID
      url: "https://api.example.com/upload/documents",
      method: "POST",
      headers: {
        Authorization: "Bearer your-token-here",
      },
      fieldName: "document", // FormData field name
      additionalData: {
        folder: "documents",
        category: "official",
      },
      transform: (response) => {
        // API response থেকে file URL বের করুন
        return response.data.fileUrl;
      },
    },
    {
      id: "image-upload",
      url: "https://api.example.com/upload/images",
      method: "POST",
      headers: {
        Authorization: "Bearer your-token-here",
      },
      fieldName: "image",
      additionalData: {
        folder: "profile-pictures",
        resize: "300x300",
      },
      transform: (response) => response.data.imageUrl,
    },
  ],

  steps: [
    {
      title: "Documents",
      sections: [
        {
          title: "Upload Documents",
          fields: [
            // File field - uploadSourceId দিয়ে reference করুন
            {
              name: "passport",
              label: "Passport Copy",
              type: "file",
              uploadSourceId: "document-upload", // Reference to upload source
              accept: ".pdf",
              cols: 12,
            },
            {
              name: "nid",
              label: "National ID",
              type: "file",
              uploadSourceId: "document-upload", // Same upload source
              accept: ".pdf",
              cols: 12,
            },
            {
              name: "cv",
              label: "CV/Resume",
              type: "file",
              uploadSourceId: "document-upload", // Same upload source
              accept: ".pdf,.doc,.docx",
              cols: 12,
            },
            // Profile picture - uploadSourceId দিয়ে
            {
              name: "profile_picture",
              label: "Profile Picture",
              type: "profilePicture",
              uploadSourceId: "image-upload", // Different upload source
              accept: "image/*",
              maxSize: 2097152, // 2MB
              cols: 12,
            },
          ],
        },
      ],
    },
  ],
};
```

## ২. API Response Format

আপনার API এইরকম response দিতে হবে:

```json
{
  "success": true,
  "data": {
    "fileUrl": "https://cdn.example.com/documents/passport_123.pdf",
    "fileName": "passport_123.pdf",
    "fileSize": 1048576
  }
}
```

`transform` function দিয়ে এই response থেকে শুধু URL বের করে নিতে পারবেন।

## ৩. Multiple Upload Sources

বিভিন্ন ধরনের file এর জন্য আলাদা upload source তৈরি করুন:

```typescript
uploadSources: [
  // PDF documents
  {
    id: "pdf-upload",
    url: "https://api.example.com/upload/pdf",
    transform: (res) => res.data.pdfUrl,
  },
  // Images
  {
    id: "image-upload",
    url: "https://api.example.com/upload/images",
    transform: (res) => res.data.imageUrl,
  },
  // Videos
  {
    id: "video-upload",
    url: "https://api.example.com/upload/videos",
    transform: (res) => res.data.videoUrl,
  },
];
```

## ৪. Field Configuration

### File Field with Upload Source

```typescript
{
  name: "document",
  label: "Upload Document",
  type: "file",
  uploadSourceId: "document-upload",  // Reference করুন
  accept: ".pdf",
  cols: 12
}
```

### Profile Picture with Upload Source

```typescript
{
  name: "avatar",
  label: "Profile Picture",
  type: "profilePicture",
  uploadSourceId: "image-upload",  // Reference করুন
  maxSize: 2097152,  // 2MB
  cols: 12
}
```

### Without Upload Source (Manual)

Upload source না দিলে file টা form data তে থাকবে:

```typescript
{
  name: "manual_file",
  label: "Manual Upload",
  type: "file",
  // No uploadSourceId - file will be in form data
  cols: 12
}
```

## ৫. Advantages

✅ **একবার configure করুন** - API configuration একবার লিখুন, সব file field এ use করুন

✅ **Easy maintenance** - API endpoint পরিবর্তন হলে এক জায়গায় update করুন

✅ **Flexible** - বিভিন্ন upload destination এর জন্য আলাদা source তৈরি করুন

✅ **Clean code** - প্রতিটি field এ বার বার একই configuration লিখতে হয় না

## ৬. Form Submission

File upload হয়ে গেলে form এ শুধু URL থাকবে:

```javascript
const formData = {
  passport: "https://cdn.example.com/documents/passport_123.pdf",
  nid: "https://cdn.example.com/documents/nid_456.pdf",
  cv: "https://cdn.example.com/documents/cv_789.pdf",
  profile_picture: "https://cdn.example.com/images/avatar_321.jpg",
};
```

এটা submit করলে backend এ শুধু URL যাবে, file না।
