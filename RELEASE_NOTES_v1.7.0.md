# Release Notes - v1.7.0

## 🎉 API Data Sources - Major New Feature!

We're excited to announce version **1.7.0** with a powerful new feature: **API Data Sources**!

### 🚀 What's New

#### API Data Sources

Fetch and display data from APIs directly in your forms with read-only fields. Perfect for displaying user profiles, company information, or any data from your backend.

```typescript
const schema: FormSchema = {
  dataSources: [
    {
      id: "userProfile",
      url: "/api/user/profile",
      method: "GET",
      transform: (data) => ({
        fullName: `${data.firstName} ${data.lastName}`,
      }),
    },
  ],
  fields: [
    {
      name: "userName",
      label: "User Name",
      type: "text",
      readOnly: true,
      dataSourceId: "userProfile",
      dataPath: "fullName",
    },
  ],
};
```

### ✨ Key Features

- **Multiple API Endpoints** - Use different APIs for different fields/sections
- **Read-Only Fields** - Display API data without allowing edits
- **Loading States** - Automatic "Loading..." display while fetching
- **Error Handling** - Graceful error messages when API fails
- **Transform Responses** - Modify API data before display
- **Nested Data Paths** - Access nested data with dot notation (`user.profile.name`)
- **GET & POST Support** - Flexible HTTP methods
- **Automatic Caching** - No duplicate API calls

### 📖 Use Cases

1. **User Profile Display**

   ```typescript
   // Show user info from API in read-only mode
   { readOnly: true, dataSourceId: 'userProfile', dataPath: 'email' }
   ```

2. **Company Information**

   ```typescript
   // Display company details from backend
   { readOnly: true, dataSourceId: 'companyInfo', dataPath: 'name' }
   ```

3. **Order Details**

   ```typescript
   // Show order information that can't be edited
   { readOnly: true, dataSourceId: 'orderData', dataPath: 'orderNumber' }
   ```

4. **Mixed Forms**
   ```typescript
   // Combine read-only API data with editable fields
   fields: [
     { readOnly: true, dataSourceId: "api", dataPath: "userId" },
     { name: "notes", type: "textarea" }, // Editable
   ];
   ```

### 📚 Documentation

- **[API_DATA_GUIDE.md](./API_DATA_GUIDE.md)** - Complete guide with examples
- **[apiDataFormSchema.ts](./src/examples/apiDataFormSchema.ts)** - Working examples
- Updated **[README.md](./README.md)** with comprehensive documentation

### 🔧 Technical Details

**New Types:**

- `DataSource` interface for API configuration
- `readOnly`, `dataSourceId`, `dataPath` field properties

**New Hook:**

- `useDataSources` - Manages API data fetching and caching

**Enhanced Components:**

- `FormEngine` - DataSourceContext provider
- `FieldRenderer` - Read-only field rendering with API data

### 🎯 Example: Complete Form

```typescript
const schema: FormSchema = {
  dataSources: [
    {
      id: "userProfile",
      url: "/api/user/profile",
      method: "GET",
    },
    {
      id: "companyInfo",
      url: "/api/company",
      method: "GET",
    },
  ],
  steps: [
    {
      title: "Your Profile",
      fields: [
        {
          name: "userName",
          label: "Name",
          type: "text",
          readOnly: true,
          dataSourceId: "userProfile",
          dataPath: "fullName",
        },
        {
          name: "userEmail",
          label: "Email",
          type: "text",
          readOnly: true,
          dataSourceId: "userProfile",
          dataPath: "email",
        },
      ],
    },
    {
      title: "Company",
      fields: [
        {
          name: "companyName",
          label: "Company Name",
          type: "text",
          readOnly: true,
          dataSourceId: "companyInfo",
          dataPath: "name",
        },
      ],
    },
    {
      title: "Additional Notes",
      fields: [
        {
          name: "notes",
          label: "Notes",
          type: "textarea",
          placeholder: "Add your notes...",
        },
      ],
    },
  ],
};
```

### 🔄 Migration Guide

No breaking changes! If you're upgrading from v1.6.0:

1. Update package:

   ```bash
   npm install react-hook-form-engine@1.7.0
   ```

2. Start using API data sources (optional):
   ```typescript
   const schema: FormSchema = {
     dataSources: [...],  // Add this
     fields: [...]
   };
   ```

### 📦 What's Included

- ✅ New feature: API Data Sources
- ✅ Enhanced documentation
- ✅ New examples
- ✅ No breaking changes
- ✅ Backward compatible

### 🐛 Bug Fixes

None - This is a feature release!

### 📊 Version History

- **v1.7.0** (Current) - API Data Sources
- **v1.6.0** - Repeatable Sections
- **v1.5.0** - Field-Level Validation
- **v1.4.0** - Phone, Password, Profile Picture fields
- **v1.3.0** - Multi-Select Support
- **v1.2.0** - Nested Field Groups
- **v1.1.0** - Dynamic Select Options
- **v1.0.0** - Initial Release

### 🙏 Thank You

Thank you to all users and contributors! We hope this new feature makes your forms even more powerful.

### 🔗 Links

- [GitHub Repository](https://github.com/amiruleeeiu/form-engine)
- [npm Package](https://www.npmjs.com/package/react-hook-form-engine)
- [Report Issues](https://github.com/amiruleeeiu/form-engine/issues)
- [Full Changelog](./CHANGELOG.md)

### 💬 Feedback

We'd love to hear your feedback! Please:

- ⭐ Star the repo if you like it
- 🐛 Report bugs on GitHub
- 💡 Suggest new features
- 📝 Contribute improvements

---

**Happy coding! 🚀**

_Made with ❤️ by [amiruleeeiu](https://github.com/amiruleeeiu)_
