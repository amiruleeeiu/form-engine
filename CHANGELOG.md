# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2024-12-12

### ✨ Added

- **API Data Sources** - Major new feature for fetching and displaying data from APIs
  - Support for multiple API endpoints in a single form
  - Read-only fields with API data binding
  - Works on field, section, and step levels
  - Loading states and error handling
  - Response transformation with `transform` function
  - Nested data path support (e.g., `user.profile.name`)
  - GET and POST HTTP methods support
  - Automatic request caching to prevent duplicate API calls
  - New `DataSource` interface for API configuration
  - New `readOnly` property for fields
  - New `dataSourceId` and `dataPath` properties for data binding
  - Created `useDataSources` hook for API data management
  - Added `DataSourceContext` for sharing data across components

### 📚 Documentation

- Added comprehensive `API_DATA_GUIDE.md` with examples and use cases
- Updated README.md with API data sources documentation
- Updated README.npm.md for npm package
- Added multiple API data examples in `apiDataFormSchema.ts`
- Enhanced main README with all features and comprehensive examples

### 🔧 Technical

- New hook: `useDataSources.ts` for managing API data fetching
- Enhanced `FormEngine.tsx` with DataSourceContext provider
- Updated `FieldRenderer.tsx` to render read-only fields with API data
- Extended type definitions in `types/index.ts`

### 📦 Package

- Bumped version to 1.7.0
- Updated package description to include API data sources

## [1.6.0] - 2024-11-15

### ✨ Added

- **Repeatable Sections (Field Arrays)** - Dynamic add/remove field groups
  - `repeatable` property for sections
  - `repeatableConfig` for customization
  - Min/max items configuration
  - Initial items setting
  - Default values for new items
  - Custom button text and styling
  - Perfect for work experience, education, skills lists

### 📚 Documentation

- Added `REPEATABLE_SECTIONS_GUIDE.md`
- Added `REPEATABLE_SECTIONS_CONFIG_GUIDE.md`
- Added example schemas demonstrating repeatable sections

### 🔧 Improvements

- Enhanced form data structure for nested arrays
- Better validation support for repeatable sections
- Improved UI for add/remove buttons

## [1.5.0] - 2024-10-20

### ✨ Added

- **Field-Level Validation** - No Zod schema required
  - Per-field validation rules
  - Support for all field types
  - Custom error messages
  - Mix with Zod schemas
  - Validation rules: `required`, `minLength`, `maxLength`, `min`, `max`, `pattern`, `email`, `custom`

### 📚 Documentation

- Added `FIELD_VALIDATION_GUIDE.md`
- Added `SIMPLE_FORM_VALIDATION.md`
- Added `fieldLevelValidationSchema.ts` example

### 🐛 Fixed

- FileField "uncontrolled to controlled" warning
- Improved field spacing and layout

### 🔧 Improvements

- Better validation error messages
- Enhanced NumberField validation
- Cleaner validation API

## [1.4.0] - 2024-09-15

### ✨ Added

- **Phone Field** with international support
  - Country selection dropdown
  - Phone number formatting
  - `defaultCountry` property
  - Validation support
- **Password Field** with visibility toggle

  - Show/hide password functionality
  - `showToggle` property
  - Secure input handling

- **Profile Picture Field**
  - Avatar upload with preview
  - Image cropping support
  - API upload configuration
  - File size validation

### 📚 Documentation

- Added `NEW_FIELDS_SUMMARY.md`
- Added `NEW_FIELDS_QUICK_REFERENCE.md`
- Updated usage examples

### 🔧 Improvements

- Enhanced file upload handling
- Better error states for file fields

## [1.3.0] - 2024-08-10

### ✨ Added

- **Multi-Select Support** for SelectField
  - `isMulti` property
  - Tag-based selection UI
  - Search functionality for multi-select
  - Remove selected items

### 🔧 Improvements

- Better dropdown positioning
- Enhanced keyboard navigation
- Improved accessibility

## [1.2.0] - 2024-07-05

### ✨ Added

- **Nested Field Groups**
  - `fieldGroup` property for sections
  - Creates nested data structures
  - Better organization for complex forms

### 📚 Documentation

- Added `NESTED_FIELD_GROUPS_GUIDE.md`
- Added examples for nested structures

## [1.1.0] - 2024-06-01

### ✨ Added

- **Dynamic Select Options**
  - Load options from API
  - `dynamicOptions` configuration
  - Transform response data
  - Custom fetch functions

### 🔧 Improvements

- Better select dropdown UI
- Search functionality
- Loading states

## [1.0.0] - 2024-05-01

### 🎉 Initial Release

#### Core Features

- **Rich Field Components**

  - Text, Textarea, Number
  - Date picker with calendar UI
  - Select dropdown
  - File upload
  - Radio and Checkbox
  - Full validation support

- **Beautiful UI**

  - Tailwind CSS styling
  - Responsive 12-column grid
  - Mobile-first design
  - Clean and modern

- **Validation**

  - Zod schema validation
  - Real-time validation
  - Custom error messages

- **Conditional Logic**

  - Show/hide fields
  - Enable/disable fields
  - Clear dependent fields
  - Multiple operators

- **Multi-Step Forms**

  - Wizard/stepper forms
  - Progress indicator
  - Conditional steps
  - Per-step validation

- **Flexible Structure**

  - Simple forms with fields
  - Forms with sections
  - Multi-step forms
  - Mix and match

- **Developer Experience**
  - Full TypeScript support
  - Clean API
  - Modular architecture
  - Comprehensive documentation

#### Documentation

- Complete README
- Usage guides
- Multiple examples
- API reference

---

## Legend

- ✨ Added - New features
- 🔧 Improvements - Enhancements to existing features
- 🐛 Fixed - Bug fixes
- 📚 Documentation - Documentation updates
- 🚀 Performance - Performance improvements
- 💥 Breaking - Breaking changes
- 📦 Package - Package/build related changes
