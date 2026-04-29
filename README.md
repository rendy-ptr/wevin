# Wevin

A premium Next.js 16 starter project with a robust developer experience and modern tech stack.

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🛠️ Key Packages & Tools

We've set up several tools to ensure code quality and consistency:

### 🎨 Formatting & Linting
- **[Prettier](https://prettier.io/)**: Code formatting with automated class sorting via `prettier-plugin-tailwindcss`.
- **[ESLint](https://eslint.org/)**: Configured with `eslint-plugin-simple-import-sort` for consistent import ordering.
- **[Husky](https://typicode.github.io/husky/) & [lint-staged](https://github.com/lint-staged/lint-staged)**: Automatically runs linting and formatting on every commit to ensure zero-broken-code in the repository.

### 🧩 UI Utilities
- **[clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge)**: Combined into a `cn()` utility for flexible and conflict-free Tailwind class management.

## 📂 Project Structure

```text
src/
├── app/            # Next.js App Router (pages and layouts)
├── components/     # UI and Layout components
│   ├── ui/         # Base UI primitives
│   └── layout/     # Reusable layout sections
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and shared logic
├── services/       # API services and business logic
├── styles/         # Global styles and Tailwind config
└── types/          # TypeScript definitions
```

## ⌨️ Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 License

This project is private and proprietary.
