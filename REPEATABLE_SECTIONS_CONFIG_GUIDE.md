# Repeatable Sections Configuration Guide

## Understanding `initialItems` vs `minItems`

### `initialItems` - Form Load এ কতটা Item থাকবে

- Form load হলে কতগুলো item automatically তৈরি হবে তা নির্ধারণ করে
- User experience improve করার জন্য ব্যবহার করা হয়
- Default: `minItems` এর value

### `minItems` - Minimum কতটা Item Required

- User minimum কতগুলো item fill করতে হবে তা নির্ধারণ করে
- এর নিচে remove করা যাবে না
- Validation এর জন্য ব্যবহার করা হয়
- Default: `0`

---

## Scenarios / বিভিন্ন পরিস্থিতি

### Scenario 1: Optional Section কিন্তু 1টা Item দিয়ে শুরু

**Use Case:** Work experience optional কিন্তু user এর সুবিধার জন্য 1টা empty field দেখাতে চান

```typescript
repeatableConfig: {
  initialItems: 1, // Form load এ 1টা item থাকবে
  minItems: 0,     // কিন্তু সব remove করা যাবে
  maxItems: 10,
}
```

**Result:**

- ✅ Form load হলে 1টা experience item তৈরি থাকবে
- ✅ User চাইলে এটা remove করতে পারবে (0 হতে পারে)
- ✅ Optional section হিসেবে কাজ করবে

---

### Scenario 2: Required Section, Minimum 1টা Item

**Use Case:** Work experience mandatory, কমপক্ষে 1টা থাকতেই হবে

```typescript
repeatableConfig: {
  // initialItems না দিলে minItems use হবে
  minItems: 1,  // Form load এ 1টা + minimum 1টা required
  maxItems: 10,
}
```

**Result:**

- ✅ Form load হলে 1টা experience item তৈরি থাকবে
- ❌ User এটা remove করতে পারবে না (minimum 1টা থাকতে হবে)
- ✅ Required section হিসেবে কাজ করবে

---

### Scenario 3: Required Section কিন্তু 2টা Item দিয়ে শুরু

**Use Case:** Education mandatory, সাধারণত 2টা (High School + College) থাকে

```typescript
repeatableConfig: {
  initialItems: 2, // Form load এ 2টা item থাকবে
  minItems: 1,     // কিন্তু minimum 1টা required
  maxItems: 5,
}
```

**Result:**

- ✅ Form load হলে 2টা education item তৈরি থাকবে
- ✅ User 1টা remove করতে পারবে (কিন্তু minimum 1টা থাকতে হবে)
- ✅ Better UX for common use case

---

### Scenario 4: Completely Optional, শুরুতে কিছু না

**Use Case:** Skills optional, user চাইলে add করবে

```typescript
repeatableConfig: {
  initialItems: 0, // বা এটা না দিলেও হবে
  minItems: 0,     // Completely optional
  maxItems: 20,
}
```

**Result:**

- ❌ Form load হলে কোনো item থাকবে না
- ✅ User "Add Skill" button click করে add করবে
- ✅ Completely optional section

---

### Scenario 5: Pre-filled with 3 Items

**Use Case:** References section, সাধারণত 3টা reference দেওয়া হয়

```typescript
repeatableConfig: {
  initialItems: 3, // Form load এ 3টা item থাকবে
  minItems: 2,     // Minimum 2টা required
  maxItems: 5,
}
```

**Result:**

- ✅ Form load হলে 3টা reference item তৈরি থাকবে
- ✅ User maximum 1টা remove করতে পারবে (minimum 2টা থাকতে হবে)
- ✅ Good for common cases

---

## Configuration Examples

### Example 1: Work Experience (Optional but pre-filled)

```typescript
{
  title: "Work Experience",
  repeatable: true,
  repeatableConfig: {
    addButtonText: "Add Experience",
    removeButtonText: "Remove",
    initialItems: 1,  // ✅ 1টা ready to fill
    minItems: 0,      // ✅ Optional, can remove all
    maxItems: 10,
  },
  fields: [/* ... */]
}
```

### Example 2: Education (Required, minimum 1)

```typescript
{
  title: "Education",
  repeatable: true,
  repeatableConfig: {
    addButtonText: "Add Education",
    removeButtonText: "Remove",
    minItems: 1,      // ✅ Mandatory, at least 1
    maxItems: 5,
  },
  fields: [/* ... */]
}
```

### Example 3: Skills (Completely Optional)

```typescript
{
  title: "Skills",
  repeatable: true,
  repeatableConfig: {
    addButtonText: "Add Skill",
    removeButtonText: "Remove",
    minItems: 0,      // ✅ Optional
    maxItems: 20,
  },
  fields: [/* ... */]
}
```

### Example 4: References (Pre-filled with 3)

```typescript
{
  title: "References",
  repeatable: true,
  repeatableConfig: {
    addButtonText: "Add Reference",
    removeButtonText: "Remove",
    initialItems: 3,  // ✅ 3টা pre-filled
    minItems: 2,      // ✅ Minimum 2টা required
    maxItems: 5,
  },
  fields: [/* ... */]
}
```

---

## Quick Reference Table

| Config       | `initialItems` | `minItems` | Form Load এ | Remove করা যাবে | Use Case                  |
| ------------ | -------------- | ---------- | ----------- | --------------- | ------------------------- |
| **Config 1** | `1`            | `0`        | 1 item      | ✅ সব           | Optional but pre-filled   |
| **Config 2** | `1`            | `1`        | 1 item      | ❌ Last item    | Required, minimum 1       |
| **Config 3** | `0`            | `0`        | 0 items     | ✅ সব           | Completely optional       |
| **Config 4** | `2`            | `1`        | 2 items     | ✅ 1টা পর্যন্ত  | Required but 2 pre-filled |
| **Config 5** | `3`            | `2`        | 3 items     | ✅ 1টা পর্যন্ত  | Required 2, suggest 3     |
| **Config 6** | -              | `2`        | 2 items     | ❌ Below 2      | Required 2 minimum        |

---

## Rules to Remember

1. **If `initialItems` is NOT provided:**
   - Uses `minItems` value as initial count
2. **If `initialItems` is provided:**

   - Form loads with `initialItems` number of items
   - But user can only remove down to `minItems`

3. **Best Practice:**
   - Use `initialItems` > `minItems` for better UX
   - Example: `initialItems: 1, minItems: 0` for optional sections
4. **Remove Button Visibility:**
   - Remove button shows only when `items.length > minItems`
   - Last item (when at minItems) won't have remove button

---

## Summary / সারাংশ

### বাংলায়:

- `initialItems` = Form load হলে কতগুলো item তৈরি হবে
- `minItems` = Minimum কতগুলো item থাকতে হবে (validation)
- `initialItems` না দিলে `minItems` ব্যবহার হবে
- `initialItems > minItems` হলে user কিছু item remove করতে পারবে

### In English:

- `initialItems` = How many items to create on form load
- `minItems` = Minimum required items (validation)
- If `initialItems` not provided, uses `minItems`
- If `initialItems > minItems`, user can remove some items
