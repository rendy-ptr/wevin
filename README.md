# Wevin

A premium Next.js 16 starter project with a robust developer experience and modern tech stack.

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Analytics**: [@vercel/analytics](https://vercel.com/analytics)

## 🛠️ Key Packages & Tools

We've set up several tools to ensure code quality and consistency:

### 🎨 Formatting & Linting

- **[Prettier](https://prettier.io/)**: Code formatting with:
  - `prettier-plugin-tailwindcss`: Automated class sorting.
  - `prettier-plugin-organize-imports`: Automatic import sorting and unused import removal.
- **[ESLint](https://eslint.org/)**: Standard Next.js linting rules.
- **[Husky](https://typicode.github.io/husky/) & [lint-staged](https://github.com/lint-staged/lint-staged)**: Automatically runs linting and formatting on every commit to ensure zero-broken-code in the repository.

### 🧩 UI Utilities

- **[clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge)**: Combined into a `cn()` utility for flexible and conflict-free Tailwind class management.
- **[Lucide React](https://lucide.dev/)**: Comprehensive icon library for modern UI design.

### 📈 Monitoring

- **Vercel Analytics**: Built-in tracking for Web Vitals and visitor insights, optimized for the Vercel platform.

## 📂 Project Structure

```text
src/
├── app/            # Next.js App Router (pages and layouts)
├── components/     # UI and Layout components
│   ├── ui/         # Base UI primitives (e.g., buttons, inputs)
│   └── layout/     # Reusable layout sections (e.g., navbar, footer)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and shared logic (e.g., metadata helper)
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
