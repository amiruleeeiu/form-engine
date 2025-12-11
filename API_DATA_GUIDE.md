# API Data Sources - Usage Guide

এই form engine এ আপনি API থেকে data fetch করে read-only fields এ display করতে পারবেন। এটা খুবই সহজ এবং flexible।

## ⚡ Quick Example

```typescript
const schema: FormSchema = {
  dataSources: [
    {
      id: "userProfile",
      url: "/api/user/profile",
      method: "GET",
    },
  ],
  fields: [
    {
      name: "userName",
      label: "User Name",
      type: "text",
      readOnly: true,
      dataSourceId: "userProfile",
      dataPath: "name",
    },
  ],
};
```

## 📋 Features

- ✅ Multiple API endpoints support
- ✅ Data fetch করে field, section বা step এ show করা
- ✅ Loading state এবং error handling
- ✅ Response transform করা যায়
- ✅ Nested data path support (e.g., `user.address.city`)
- ✅ GET এবং POST method support

## 🔧 Configuration

### 1. Data Source Define করুন

```typescript
{
  dataSources: [
    {
      id: "userProfile", // Unique ID
      url: "/api/user/profile", // API endpoint
      method: "GET", // HTTP method (default: GET)
      headers: {
        // Optional headers
        Authorization: "Bearer token",
      },
      params: {
        // Query params (GET) or body (POST)
        userId: "123",
      },
      transform: (data) => ({
        // Optional: Transform response
        fullName: data.firstName + " " + data.lastName,
      }),
    },
  ];
}
```

### 2. Field এ Use করুন

```typescript
{
  name: "userName",
  label: "User Name",
  type: "text",
  readOnly: true,              // Read-only করতে হবে
  dataSourceId: "userProfile", // Data source ID
  dataPath: "fullName"         // Response এর path
}
```

## 📝 Examples

### Example 1: Single API, Multiple Fields

```typescript
{
  dataSources: [
    {
      id: "userInfo",
      url: "/api/user",
      method: "GET"
    }
  ],
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      readOnly: true,
      dataSourceId: "userInfo",
      dataPath: "name"
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      readOnly: true,
      dataSourceId: "userInfo",
      dataPath: "email"
    }
  ]
}
```

### Example 2: Multiple APIs, Different Sections

```typescript
{
  dataSources: [
    {
      id: "userProfile",
      url: "/api/user/profile",
      method: "GET"
    },
    {
      id: "companyInfo",
      url: "/api/company",
      method: "GET"
    }
  ],
  sections: [
    {
      title: "Personal Info",
      fields: [
        {
          name: "userName",
          label: "Name",
          type: "text",
          readOnly: true,
          dataSourceId: "userProfile",
          dataPath: "name"
        }
      ]
    },
    {
      title: "Company Info",
      fields: [
        {
          name: "companyName",
          label: "Company",
          type: "text",
          readOnly: true,
          dataSourceId: "companyInfo",
          dataPath: "name"
        }
      ]
    }
  ]
}
```

### Example 3: Stepper Form with API Data

```typescript
{
  dataSources: [
    {
      id: "profile",
      url: "/api/profile",
      method: "GET"
    },
    {
      id: "address",
      url: "/api/address",
      method: "POST",
      params: { userId: "123" }
    }
  ],
  steps: [
    {
      title: "Profile",
      fields: [
        {
          name: "name",
          label: "Name",
          type: "text",
          readOnly: true,
          dataSourceId: "profile",
          dataPath: "fullName"
        }
      ]
    },
    {
      title: "Address",
      fields: [
        {
          name: "street",
          label: "Street",
          type: "text",
          readOnly: true,
          dataSourceId: "address",
          dataPath: "street"
        },
        {
          name: "city",
          label: "City",
          type: "text",
          readOnly: true,
          dataSourceId: "address",
          dataPath: "city"
        }
      ]
    }
  ]
}
```

### Example 4: Transform Response

```typescript
{
  dataSources: [
    {
      id: "userData",
      url: "/api/user",
      method: "GET",
      transform: (response) => {
        // API response: { first_name: "John", last_name: "Doe" }
        return {
          fullName: `${response.first_name} ${response.last_name}`
        };
      }
    }
  ],
  fields: [
    {
      name: "userName",
      label: "Full Name",
      type: "text",
      readOnly: true,
      dataSourceId: "userData",
      dataPath: "fullName" // Transformed data থেকে
    }
  ]
}
```

### Example 5: Nested Data Path

```typescript
// API Response:
// {
//   user: {
//     personal: {
//       name: "John Doe",
//       age: 30
//     },
//     contact: {
//       email: "john@example.com"
//     }
//   }
// }

{
  dataSources: [
    {
      id: "userDetails",
      url: "/api/user/details",
      method: "GET"
    }
  ],
  fields: [
    {
      name: "userName",
      label: "Name",
      type: "text",
      readOnly: true,
      dataSourceId: "userDetails",
      dataPath: "user.personal.name" // Nested path
    },
    {
      name: "userEmail",
      label: "Email",
      type: "text",
      readOnly: true,
      dataSourceId: "userDetails",
      dataPath: "user.contact.email" // Nested path
    }
  ]
}
```

### Example 6: Mixed Read-Only and Editable Fields

```typescript
{
  dataSources: [
    {
      id: "currentUser",
      url: "/api/current-user",
      method: "GET"
    }
  ],
  fields: [
    // Read-only from API
    {
      name: "userId",
      label: "User ID",
      type: "text",
      readOnly: true,
      dataSourceId: "currentUser",
      dataPath: "id"
    },
    // Editable field
    {
      name: "displayName",
      label: "Display Name",
      type: "text",
      placeholder: "Enter your display name"
    },
    // Editable field
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      placeholder: "Tell us about yourself"
    }
  ]
}
```

## 🎨 UI Display

Read-only fields automatically display করবে:

- **Loading state**: "Loading..." text
- **Error state**: Error message with red color
- **Data state**: Data value
- **No data**: "N/A" text
- **Gray background**: Read-only fields এ gray background থাকবে

## 🔄 Loading & Error States

Form automatically handle করবে:

- Data fetch হওয়ার সময় "Loading..." দেখাবে
- Error হলে error message দেখাবে
- Data আসলে display করবে

## 💡 Tips

1. **Multiple fields, one API**: একটা API থেকে multiple fields এ data map করুন
2. **Transform data**: API response যদি complex হয়, transform করে নিন
3. **Nested paths**: Dot notation use করে nested data access করুন
4. **Error handling**: Error automatically handle হয়, manual কিছু করতে হবে না
5. **Caching**: Same data source multiple বার call হবে না, automatic caching হয়

## 📦 Complete Example

দেখুন: `src/examples/apiDataFormSchema.ts`

```typescript
import {
  apiDataFormSchema,
  mixedFieldsSchema,
} from "./examples/apiDataFormSchema";

// Use in your app
<FormEngine schema={apiDataFormSchema} onSubmit={handleSubmit} />;
```

## 🚀 Backend Setup

আপনার API endpoints এমন response দিতে হবে:

```javascript
// GET /api/user/profile
{
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "john@example.com",
  "phoneNumber": "+8801234567890"
}

// GET /api/company/details
{
  "name": "Acme Corp",
  "registrationNumber": "123456",
  "email": "info@acme.com"
}
```

CORS enable করতে ভুলবেন না!

## ❓ Common Use Cases

1. **User Profile Display**: User এর information read-only দেখানো
2. **Company Information**: Company details API থেকে load করা
3. **Address Lookup**: Address API থেকে pre-fill করা
4. **Order Details**: Order information read-only দেখানো
5. **Application Status**: Application status display করা

---

সহজ, সোজা এবং powerful! 🎉
