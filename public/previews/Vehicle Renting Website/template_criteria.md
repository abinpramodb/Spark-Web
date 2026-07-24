# Spark Web Template Integration Criteria

To ensure any common static website template (or custom code) is fully compatible with the Spark Web storefront, the interactive device previewer, and the visual GrapesJS builder, it must satisfy the following integration criteria:

---

## 📂 1. Directory Structure & Location

Every website template must be self-contained within its own folder placed under the `public/previews/` directory:

```text
public/previews/
└── your-template-slug/             <-- The template folder of your choice (e.g., "template-6")
    ├── index.html                  <-- Main entrypoint page
    ├── style.css                   <-- CSS styles and rules
    ├── css/                        <-- (Optional) folder for additional styling files
    ├── js/                         <-- (Optional) folder for client-side scripts
    └── assets/ or images/          <-- (Optional) folder for graphics, logos, and photos
```

---

## 💻 2. Template Code Requirements

### Static Code Only (Client-Side)
* **Supported:** Standard frontend web elements: HTML5, CSS3, JavaScript, web fonts, SVGs, and images.
* **Not Supported:** Server-side templating files (such as `.php`, `.py`, `.jsp`, or backend database queries). Templates must render entirely in the browser client.

### Main Entrypoint (`index.html`)
* The template must have a file named **`index.html`** in its root folder. This file acts as the primary layout loaded by the customizer canvas.
* GrapesJS extracts the elements inside the `<body>` tag to render the visual workspace. Keep your body markup wrapped inside clean semantic sections (like `<header>`, `<section>`, `<footer>`).

### Asset Link Pathing
* All assets, links, and stylesheets must be path-safe inside the isolated preview folder:
  * **Relative Links:** Standard relative references (e.g., `<link href="css/style.css">`, `<img src="images/logo.png">`) are fully supported and resolve relative to the template folder inside the preview sandbox.
  * **Page Navigation:** Links to other pages (e.g., `<a href="about.html">`) must target files that exist within the same template folder.

---

## 🎨 3. Styling & Framework Integration

### Consolidated Stylesheet
* All custom layouts, grid configurations, keyframes, and color declarations should be consolidated inside stylesheets (like `style.css`) and linked in the HTML head.
* Avoid heavy inline styles (`style="..."`) on tags to ensure the customizer properties inspector can override and manipulate elements cleanly.

### Frameworks & Font CDs
* If the template uses CSS frameworks (like Tailwind CSS, Bootstrap) or font libraries (like Google Fonts), include their standard CDN script/link tags inside the `<head>` of your template `index.html` so the iframe canvas compiles them:
  ```html
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts Link -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
  ```

---

## 🚀 4. Storefront Registration (Database Columns)

To publish your template onto the homepage grid, add the template entry through the **Admin Dashboard** (`/admin.html`) with the following database properties:

| Column Field | Type | Description |
| :--- | :--- | :--- |
| **Template ID** | `TEXT` | A unique identifier (matches your folder name, e.g., `template-6`). |
| **Template Name** | `TEXT` | Display title on the storefront card (e.g., `Apex SaaS Pro`). |
| **Category** | `TEXT` | Filter category: `saas`, `portfolio`, `blog`, or `ecommerce`. |
| **Description** | `TEXT` | Short description of features and layout sections. |
| **Thumbnail URL** | `TEXT` | Image preview link (Unsplash or `/previews/template-slug/assets/thumb.png`). |
| **Demo Code Path** | `TEXT` | The exact folder folder name in `public/previews/` (e.g., `template-6`). |
| **Price** | `TEXT` | Set as `"Free"` or numeric currency (e.g., `"$19.00"`). |
| **Payhip URL** | `TEXT` | (Optional) Product link from your Payhip dashboard if premium. |
| **Figma URL** | `TEXT` | (Optional) Source file design URL if bundled. |
