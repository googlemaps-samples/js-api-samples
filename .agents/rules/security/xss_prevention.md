# XSS Prevention in Maps JavaScript Samples

## Overview

Cross-Site Scripting (XSS) is a significant concern when creating map samples that display data, especially in components like `InfoWindow` or custom overlays. While many samples use static, hardcoded HTML, real-world applications often incorporate dynamic data, making it crucial to demonstrate secure patterns.

## The Problem: HTML String Concatenation

Legacy samples often build HTML content by concatenating strings:

```typescript
const contentString = '<div>' + data.name + '</div>';
infowindow.setContent(contentString);
```

If `data.name` contains a script tag (e.g., `<script>alert('XSS')</script>`), it will be executed when the info window opens.

## The Solution: DOM APIs

The preferred pattern for security is using the browser's DOM APIs to construct elements. This treats data as text nodes, which are not parsed as HTML.

### Implementation Pattern

Instead of a string, build a DOM element and pass it to the `content` property or `setContent()`:

```typescript
const content = document.createElement("div");
const nameElement = document.createElement("h1");

// TextContent safely escapes any HTML characters
nameElement.textContent = data.name; 
content.appendChild(nameElement);

infowindow.setContent(content);
```

### InfoWindow `headerContent`

The `google.maps.InfoWindow` class now provides a `headerContent` property specifically for titles. This property accepts a string or a DOM element and is a safe and structurally correct way to handle titles without needing to build them manually into the main `content` DOM structure.

```typescript
const infowindow = new google.maps.InfoWindow({
    headerContent: "Location Title", // Safe and preferred
    content: content,
    ariaLabel: "Location Title",
});
```

For complex structures with multiple text nodes and elements:
```typescript
const p = document.createElement("p");
p.appendChild(document.createTextNode("Attribution: "));
const a = document.createElement("a");
a.href = "https://example.com";
a.textContent = "Source";
a.target = "_blank"; // Best practice for external links
p.appendChild(a);
```

## Policy for Samples

1.  **Static Content**: If a sample is purely pedagogical and uses only hardcoded, static strings for UI content, string concatenation or template literals are acceptable for simplicity.
2.  **Dynamic Content**: If a sample handles any form of dynamic, external, or user-controlled input, **DOM APIs are mandatory**.
3.  **Educational Value**: Even for static samples, using the DOM API pattern is highly encouraged to promote best practices. The `infowindow-simple` sample was refactored to use this pattern for this reason.

## Sanitization Alternative

For cases where complex HTML structures are received from a source that should allow some HTML but must be safe, using a library like **DOMPurify** is recommended:

```typescript
import DOMPurify from 'dompurify';

const cleanHtml = DOMPurify.sanitize(dirtyHtml);
infowindow.setContent(cleanHtml);
```
