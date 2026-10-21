# XSS Vulnerability Findings - Quick Reference

## Files with XSS-Unsafe DOM Manipulation

### 🔴 CRITICAL - Requires Immediate Fix (7 files)

These files use `innerHTML` with dynamic, unsanitized data:

1. **`samples/advanced-markers-html/index.ts`** (Line 48)
   - Inserts property data (type, price, address, bed, bath, size) into HTML without escaping
   - Example: `content.innerHTML = \`...\${property.address}...\``

2. **`samples/3d-places/index.ts`** (Lines 29, 30, 34)
   - Inserts Places API data (displayName, id, types) without sanitization
   - Example: `element.innerHTML = "<b>Name :</b>" + place.displayName`

3. **`samples/deckgl-kml/index.ts`** (Line 132)
   - Inserts KML properties into tooltip HTML
   - KML description field can contain arbitrary HTML
   - Example: `tooltip.innerHTML = tooltipContent` with KML data

4. **`samples/deckgl-kml-updated/index.ts`** (Line 156)
   - Same vulnerability as #3

5. **`samples/deckgl-heatmap/index.ts`** (Line 100)
   - Inserts data source properties (ADDRESS, RACKS, SPACES) into tooltip
   - Example: `tooltipContent += \`\${info.object.ADDRESS}\``

6. **`samples/deckgl-polygon/index.ts`** (Line 110)
   - Similar tooltip vulnerability with dynamic data

7. **`samples/advanced-markers-graphics/index.ts`** (Line 93)
   - Uses innerHTML for icon (currently hardcoded but unsafe pattern)
   - Example: `icon.innerHTML = '<i class="fa fa-pizza-slice fa-lg"></i>'`

### 🟡 MEDIUM - Should Be Refactored (4 files)

These files use innerHTML with static content but follow unsafe patterns:

8. **`samples/react-ui-kit-place-details/src/app.tsx`** (Line 44)
9. **`samples/react-ui-kit-place-details-latlng/src/app.tsx`** (Line 45)
10. **`samples/react-ui-kit-place-details-latlng-compact/src/app.tsx`** (Line 48)
11. **`samples/react-ui-kit-place-details-compact/src/app.tsx`** (Line 47)
   - All insert static Google Maps web component markup via innerHTML
   - Currently safe but could be vulnerable if modified to include dynamic data

### 🟢 SAFE - No Action Required (2 files)

12. **`samples/weather-api-current-compact/simple-weather-widget.ts`** (Line 11)
    - Uses innerHTML in Web Component constructor with Shadow DOM (standard pattern)
    - All content is static CSS and HTML structure

13. **`samples/ui-kit-customization/index.ts`** (Lines 290, 293, 307)
    - Only uses innerHTML for clearing content (`innerHTML = ''`)
    - Dynamic elements created with safe DOM methods

### Additional Files Using innerHTML for Clearing (Safe)
- `samples/react-ui-kit-search-nearby/src/app.tsx` (Lines 130, 141)
- `samples/react-ui-kit-search-text/src/app.tsx` (Lines 134, 156)
- React UI Kit samples listed above also use `innerHTML = ''` for clearing

---

## Quick Fix Guide

### Pattern to Replace:
```typescript
// ❌ UNSAFE
element.innerHTML = `<span>${data.value}</span>`;
```

### Safe Alternative:
```typescript
// ✅ SAFE
const span = document.createElement('span');
span.textContent = data.value;
element.appendChild(span);
```

### For Multiple Children:
```typescript
// ❌ UNSAFE
element.innerHTML = `
  <div class="title">${data.title}</div>
  <div class="body">${data.body}</div>
`;
```

### Safe Alternative:
```typescript
// ✅ SAFE
const title = document.createElement('div');
title.className = 'title';
title.textContent = data.title;

const body = document.createElement('div');
body.className = 'body';
body.textContent = data.body;

element.replaceChildren(title, body);
```

---

## Priority Order for Fixes

1. **Highest:** Files handling external data (KML files, user-uploaded content)
   - `deckgl-kml/index.ts`, `deckgl-kml-updated/index.ts`

2. **High:** Files displaying API data in tooltips
   - `deckgl-heatmap/index.ts`, `deckgl-polygon/index.ts`

3. **Medium:** Files displaying property/place data
   - `advanced-markers-html/index.ts`, `3d-places/index.ts`

4. **Low:** Files with static content but unsafe patterns
   - React UI Kit samples, `advanced-markers-graphics/index.ts`

---

## Total Count

- **Total files with innerHTML usage:** 15
- **Critical vulnerabilities:** 7 files (46.7%)
- **Medium risk:** 4 files (26.7%)
- **Safe usage:** 4 files (26.7%)

---

Generated: $(date)
