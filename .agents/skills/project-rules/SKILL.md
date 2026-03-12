---
name: project-rules
description: Coding standards, tech stack, and UI/UX principles for the Portal-Pelayanan-Publik project.
---

# Portal-Pelayanan-Publik Project Rules

This skill defines the core principles and standards for the Portal-Pelayanan-Publik project. Adhere to these rules when creating or modifying code.

## Tech Stack Alignment

- **Framework**: Use Next.js 15+ with App Router. Prefer Server Components where possible; use `use client` only when necessary for state or client-side interactions.
- **Language**: TypeScript with strict typing. Avoid `any` at all costs; define interfaces for props and data structures.
- **Styling**: Tailwind CSS 4. Use its new CSS-based configuration and utility-first approach.
- **Components**: Shadcn/UI (Radix UI) based components. Maintain consistent usage patterns for Card, Table, Dialog, etc.
- **Database**: Prisma ORM with PostgreSQL. Use server actions for data mutations.
- **Animations**: Framer Motion for micro-interactions and GSAP for complex animations. Use Lenis for smooth scrolling.
- **Validation**: Zod for both client-side and server-side validation.

## Coding Standards

- **Naming**: 
  - Components: PascalCase (e.g., `BukuTamuCard.tsx`)
  - Functions/Variables: camelCase (e.g., `handleDelete`)
  - Files: kebab-case (e.g., `guest-book-actions.ts`)
- **Directory Structure**:
  - `src/app/`: File-based routing and Server Actions.
  - `src/components/ui/`: Atomic UI components (shadcn/ui).
  - `src/components/business/`: Larger functional components.
  - `src/lib/`: Shared utility functions and database configuration.
- **Performance**:
  - Optimize image loading with `next/image`.
  - Use `React.Suspense` for async data fetching.
  - Minimize the size of client-side bundles.

## UI/UX Principles (Rich Aesthetics)

- **Vibrancy**: Use modern, harmonious color palettes. Prefer deep blues and clean whites for an institutional yet premium feel.
- **Animations**: Implement subtle `framer-motion` entrance animations for page content and components (e.g., `animate-in fade-in slide-in-from-bottom-4`).
- **Feedback**: Use `sonner` for toast notifications instead of native `alert` or console errors.
- **Interactivity**: Add hover effects and micro-interactions (e.g., scaling buttons on hover) to make the interface feel "alive".
- **Glassmorphism**: Use backdrop filters for overlays and fixed elements (like navigation bars) when appropriate.

## QR Scanning & Camera (ZXing)

- **Library**: Use `@zxing/browser` and `@zxing/library` for QR detection.
- **Best Practices**:
  - Ensure camera feeds are responsive and correctly sized.
  - Handle camera permission errors gracefully with user-friendly messages.
  - Optimize decoding patterns for mobile devices.
