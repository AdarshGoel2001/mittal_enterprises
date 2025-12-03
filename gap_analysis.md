# Gap Analysis: Original vs. New Codebase

## Overview
This document outlines the discrepancies between the original PHP/MySQL codebase and the new Next.js application. While the foundation and homepage are built, significant content and functionality need to be migrated.

## Feature Comparison

| Feature | Original Implementation | New Implementation | Status |
| :--- | :--- | :--- | :--- |
| **Homepage** | `index.php` | `src/app/page.tsx` | ✅ **Completed** |
| **Header & Navigation** | `include/header.php` | `src/components/Header.tsx` | ✅ **Completed** |
| **Footer** | `include/footer.php` | `src/components/Footer.tsx` | ✅ **Completed** |
| **Styling** | Bootstrap 3 (Custom CSS) | CSS Modules + Variables | ✅ **Completed** |
| **Profile Page** | `page.php` (Dynamic) | `src/app/profile/page.tsx` | ❌ **Missing** |
| **Global Supplies** | `page.php` (Dynamic) | `src/app/global-supplies/page.tsx` | ❌ **Missing** |
| **Contact Page** | `page.php` (Dynamic) | `src/app/contact/page.tsx` | ❌ **Missing** |
| **Product Listing** | `category.php` | `src/app/products/page.tsx` | ⚠️ **Partial** (Home grid only) |
| **Category Details** | `category.php` | `src/app/products/[category]/page.tsx` | ❌ **Missing** |
| **Product Details** | `products-details.php` | `src/app/products/[category]/[slug]/page.tsx` | ❌ **Missing** |
| **Enquiry System** | `enq.php` | `src/app/enquiry/page.tsx` | ❌ **Missing** |
| **Search Functionality** | Custom PHP Search | Search Component | ❌ **Missing** |
| **Database** | MySQL (`DBmittalenter.sql`) | JSON Data / CMS | ❌ **Migration Needed** |

## Critical Missing Components

### 1. Data Migration
The original site relies heavily on a MySQL database. We need to:
- Extract **Categories** from the `categories` table.
- Extract **Products** from the `products` table (schema needs verification).
- Extract **Static Pages** (Profile, Contact) from the `pages` table.
- Convert this data into JSON files (e.g., `src/data/products.json`) or set up a headless CMS.

### 2. Dynamic Routing
The new app needs dynamic routes to handle the catalog:
- `/products`: List all main categories.
- `/products/[category]`: List products in a specific category.
- `/products/[category]/[slug]`: Show detailed product information.

### 3. Forms
The Enquiry form is a key lead generation tool. It needs to be rebuilt using React state and potentially an API route (e.g., using Resend or Nodemailer) to send emails.

## Recommendations
1.  **Extract Data**: Parse the SQL dump to create a structured JSON dataset for products and categories.
2.  **Build Dynamic Routes**: Implement the file structure for product browsing.
3.  **Migrate Content**: Manually copy or script the migration of the "Profile" and "Global Supplies" text.
