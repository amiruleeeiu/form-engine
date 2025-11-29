# Form Engine Quick Reference

## Project Overview

A complete Form Engine implementation with:
- ✅ All 8 reusable field components
- ✅ Zod validation integration
- ✅ Tailwind CSS grid layout
- ✅ Conditional logic (show/hide, enable/disable)
- ✅ Multi-step forms with stepper
- ✅ Dynamic select options (API loading)
- ✅ FormProvider architecture
- ✅ 4 complete example schemas

## Files Created

### Core Engine (10 files)
```
src/form-engine/
├── types/index.ts                    # TypeScript definitions
├── utils/
│   ├── conditionalLogic.ts          # Condition evaluation logic
│   └── dynamicOptions.ts            # API option loading
├── components/
│   ├── fields/
│   │   ├── TextField.tsx
│   │   ├── NumberField.tsx
│   │   ├── DateField.tsx
│   │   ├── SelectField.tsx
│   │   ├── AutocompleteField.tsx
│   │   ├── FileField.tsx
│   │   ├── RadioField.tsx
│   │   ├── CheckboxField.tsx
│   │   └── index.ts
│   └── core/
│       ├── FieldRenderer.tsx         # Dynamic field rendering
│       ├── FormSection.tsx           # Section with conditional logic
│       └── FormEngine.tsx            # Main form component
└── index.ts                          # Public API
```

### Examples (4 files)
```
src/examples/
├── simpleFormSchema.ts               # Basic form with sections
├── stepperFormSchema.ts              # Multi-step form
├── conditionalLogicSchema.ts         # Advanced conditions
└── dynamicSelectSchema.ts            # API-driven options
```

### Configuration (4 files)
```
├── tailwind.config.js                # Tailwind with safelist
├── postcss.config.js                 # PostCSS config
├── src/App.tsx                       # Demo application
└── src/index.css                     # Tailwind imports
```

## Key Features

### 1. Field Types
- **text**: Text input with register
- **number**: Number input with valueAsNumber
- **date**: Date picker with Controller
- **select**: Native select with static/dynamic options
- **autocomplete**: React Select with multi-select support
- **file**: File upload with Controller
- **radio**: Radio button group
- **checkbox**: Single checkbox

### 2. Conditional Logic

#### Show/Hide
```typescript
showWhen: { field: 'isMarried', equals: true }
hideWhen: { field: 'age', lessThan: 18 }
```

#### Enable/Disable
```typescript
enableWhen: { field: 'country', equals: 'BD' }
disableWhen: { field: 'email', isEmpty: true }
```

#### Operators
- `equals` / `notEquals`
- `in` / `notIn`
- `isEmpty` / `isNotEmpty`
- `greaterThan` / `lessThan`

### 3. Dynamic Options

```typescript
dynamicOptions: {
  url: 'https://api.example.com/data',
  transform: (data) => data.map(item => ({
    label: item.name,
    value: item.id
  }))
}
```

Or with custom function:
```typescript
dynamicOptions: {
  fetchFunction: async () => {
    const response = await fetch('/api/options');
    return await response.json();
  }
}
```

### 4. Grid Layout

Uses 12-column grid system:
```typescript
cols: 6  // Half width
cols: 4  // One-third width
cols: 12 // Full width
```

### 5. Validation (Zod)

```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18+'),
});

const formSchema: FormSchema = {
  validationSchema: schema,
  fields: [...]
};
```

### 6. Multi-Step Forms

```typescript
const schema: FormSchema = {
  steps: [
    {
      title: 'Step 1',
      fields: [...],
      showWhen: { ... } // Conditional steps
    },
    { title: 'Step 2', fields: [...] },
  ]
};
```

## Usage Examples

### Simple Form
```typescript
<FormEngine
  schema={simpleFormSchema}
  onSubmit={(data) => console.log(data)}
  submitButtonText="Submit"
/>
```

### Stepper Form
```typescript
<FormEngine
  schema={stepperFormSchema}
  onSubmit={(data) => console.log(data)}
  showStepNavigation={true}
/>
```

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Extending the Engine

### Add a New Field Type

1. Create `src/form-engine/components/fields/YourField.tsx`
2. Add type to `FieldType` in `types/index.ts`
3. Create `YourFieldConfig` interface
4. Add to `FieldRenderer.tsx` switch statement
5. Export from `fields/index.ts`

### Add a New Condition Operator

Edit `utils/conditionalLogic.ts`:
```typescript
export function evaluateCondition(condition, value) {
  if (condition.yourOperator !== undefined) {
    return /* your logic */;
  }
  // ...existing code
}
```

## Architecture Highlights

- **FormProvider**: Provides form context to all fields
- **useFormContext**: Fields access form methods
- **watch()**: Live reactive updates for conditions
- **Controller**: Used only for complex inputs (React Select, file)
- **register**: Used for simple inputs (text, number)
- **Zod Resolver**: Automatic validation integration

## Performance Notes

- Conditional logic uses `useMemo` to prevent unnecessary re-renders
- `watch()` only subscribes to fields needed for conditions
- Dynamic options loaded once per field

## TypeScript Support

Full TypeScript support with:
- Strict type checking
- Autocomplete for all props
- Type-safe condition operators
- Zod schema inference

## Demo Features

The demo app includes:
1. **Simple Form**: Basic form with sections and conditional fields
2. **Multi-Step Form**: Job application with 3 steps
3. **Conditional Logic**: Complex show/hide and enable/disable scenarios
4. **Dynamic API**: API-driven select options

Try all examples by clicking the tabs at the top!
