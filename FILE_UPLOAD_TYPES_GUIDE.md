# File Upload Field Types Comparison

এই form engine এ **৩ ধরনের** file upload field আছে:

## 1. Simple File Upload (`type: "file"`)

Traditional file upload with browse button.

```typescript
{
  name: "document",
  label: "Upload Document",
  type: "file",
  accept: ".pdf,.doc,.docx",
  uploadSourceId: "document-upload",
  cols: 12,
  helpText: "Click to browse and select a file"
}
```

### Features:

- ✅ Simple browse button
- ✅ Automatic API upload (with uploadSourceId)
- ✅ Manual file selection (without uploadSourceId)
- ✅ Multiple files support
- ✅ File type restriction

### Best for:

- Traditional forms
- Simple file selection
- When drag & drop is not needed

---

## 2. Drag & Drop Dropzone (`type: "dropzone"`)

Modern drag & drop file upload with visual feedback.

```typescript
{
  name: "files",
  label: "Upload Files",
  type: "dropzone",
  accept: "image/*,.pdf",
  uploadSourceId: "file-upload",
  multiple: true,
  maxSize: 5 * 1024 * 1024,  // 5MB
  maxFiles: 10,
  cols: 12,
  helpText: "Drag & drop or click to upload"
}
```

### Features:

- ✅ Drag & drop support
- ✅ Click to browse
- ✅ Visual drag feedback (blue highlight)
- ✅ File size validation
- ✅ File type validation
- ✅ Multiple files with remove option
- ✅ Uploaded files list
- ✅ File count limit (maxFiles)
- ✅ Automatic API upload

### Properties:

- `accept` - File types (e.g., "image/\*", ".pdf,.doc")
- `multiple` - Allow multiple files
- `maxSize` - Max file size in bytes
- `maxFiles` - Max number of files (for multiple)
- `uploadSourceId` - Upload source reference

### Best for:

- Modern UX
- Multiple file uploads
- When visual feedback is important
- Document management systems

---

## 3. Profile Picture Upload (`type: "profilePicture"`)

Special field for profile pictures with circular preview.

```typescript
{
  name: "avatar",
  label: "Profile Picture",
  type: "profilePicture",
  accept: "image/*",
  uploadSourceId: "image-upload",
  maxSize: 2 * 1024 * 1024,  // 2MB
  cols: 12
}
```

### Features:

- ✅ Circular preview
- ✅ Remove button on preview
- ✅ User icon placeholder
- ✅ File size validation
- ✅ Automatic API upload
- ✅ Only single file

### Best for:

- User profiles
- Avatar uploads
- Any circular image display

---

## Comparison Table

| Feature         | File        | Dropzone    | Profile Picture |
| --------------- | ----------- | ----------- | --------------- |
| Browse Button   | ✅          | ✅          | ✅              |
| Drag & Drop     | ❌          | ✅          | ❌              |
| Multiple Files  | ✅          | ✅          | ❌              |
| Preview         | ❌          | ✅ (list)   | ✅ (circular)   |
| Remove Files    | ❌          | ✅          | ✅              |
| Size Validation | ❌          | ✅          | ✅              |
| Type Validation | ✅ (accept) | ✅ (accept) | ✅ (accept)     |
| Visual Feedback | ❌          | ✅          | ✅              |
| Max Files Limit | ❌          | ✅          | N/A             |

---

## Upload Source Configuration

All three field types support centralized upload configuration:

```typescript
uploadSources: [
  {
    id: "document-upload",
    url: "https://api.example.com/upload",
    method: "POST",
    headers: {
      Authorization: "Bearer token",
    },
    fieldName: "file",
    additionalData: {
      folder: "documents",
      category: "user-files",
    },
    transform: (response) => response.data.fileUrl,
  },
];
```

Then reference in any field:

```typescript
{
  uploadSourceId: "document-upload";
}
```

---

## When to Use Which?

### Use `type: "file"` when:

- Simple file selection needed
- Traditional form design
- Drag & drop not required
- Backend handles file storage

### Use `type: "dropzone"` when:

- Modern UX desired
- Multiple file uploads
- Drag & drop functionality needed
- Visual feedback important
- File management features required

### Use `type: "profilePicture"` when:

- User avatar/profile image
- Circular image preview needed
- Single image upload only
- Profile-related forms

---

## Complete Examples

### Simple File Upload

```typescript
{
  name: "resume",
  label: "Resume",
  type: "file",
  accept: ".pdf,.doc,.docx",
  uploadSourceId: "document-upload"
}
```

### Dropzone (Single)

```typescript
{
  name: "contract",
  label: "Contract Document",
  type: "dropzone",
  accept: ".pdf",
  uploadSourceId: "document-upload",
  maxSize: 10 * 1024 * 1024
}
```

### Dropzone (Multiple)

```typescript
{
  name: "attachments",
  label: "Upload Attachments",
  type: "dropzone",
  accept: "image/*,.pdf,.doc,.docx",
  uploadSourceId: "file-upload",
  multiple: true,
  maxFiles: 5,
  maxSize: 5 * 1024 * 1024
}
```

### Profile Picture

```typescript
{
  name: "avatar",
  label: "Profile Photo",
  type: "profilePicture",
  uploadSourceId: "image-upload",
  maxSize: 2 * 1024 * 1024
}
```
