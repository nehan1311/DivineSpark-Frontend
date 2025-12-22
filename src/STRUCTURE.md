# Project Structure

This project follows a scalable feature-based structure designed for a wellness platform.

- **src/assets/**: Static assets like images and icons.
- **src/components/**: Reusable UI components.
  - **layout/**: Structural components like Header, Footer, MainLayout to wrap pages.
  - **ui/**: Generic, reusable UI elements like Button, Section, Inputs.
- **src/pages/**: High-level page components corresponding to routes (Home, Sessions, Login, Register).
- **src/routes/**: Routing configuration (AppRoutes).
- **src/styles/**: Global styling configuration.
  - `globals.css`: Reset and global base styles.
  - `variables.css`: Design tokens (Colors, Typography, Spacing).
  - `layout.css`: Utility classes for layout (Grid, Flex).
- **src/App.tsx**: Main app wrapper with Router provider.
- **src/main.tsx**: Entry point.

## Design System
The design uses CSS variables defined in `src/styles/variables.css` to ensure consistency.
- **Colors**: Earthy greens (`--color-primary`), Soft background (`--color-bg-main`), Dark text (`--color-text-primary`).
- **Typography**: 'Outfit' for headings, 'Inter' for body.
- **Spacing**: standard spacing tokens (`--space-4`, etc).
