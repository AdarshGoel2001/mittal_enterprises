# Mittal Enterprises Website Rebuild - Walkthrough

## Overview
This project is a modern rebuild of the Mittal Enterprises website using Next.js 15. The design focuses on a premium, scientific aesthetic with responsive layouts and interactive elements.

## Features
- **Modern Design**: A clean, professional look suitable for a scientific instrument manufacturer.
- **Responsive Layout**: Fully responsive on mobile, tablet, and desktop.
- **Interactive Elements**:
  - Animated Hero section using Framer Motion.
  - Hover effects on product cards.
  - Dropdown navigation menus.
- **Performance**: Optimized using Next.js App Router and server components.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: CSS Modules (Vanilla CSS) with CSS Variables for theming.
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Fonts**: Outfit (Google Fonts)

## Project Structure
- `src/app`: App Router pages and layout.
- `src/components`: Reusable UI components (Header, Footer, Hero, etc.).
- `src/components/*.module.css`: CSS Modules for component-specific styling.
- `public/images`: Static assets migrated from the old site.

## How to Run
1. Navigate to the project directory:
   ```bash
   cd web-app
   ```
2. Install dependencies (if needed):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Next Steps
- Implement the Profile page (`/profile`).
- Create dynamic routes for Product Categories (`/products/[category]`).
- Build the Contact form (`/contact`).
