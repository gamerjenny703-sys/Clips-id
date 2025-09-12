import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";

export default [
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "dist",
      "build",
      "pnpm-lock.yaml",
    ],
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignoresPatterns: ["node_modules", ".next", "dist"],

    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "@typescript-eslint": tseslint,
      prettier,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "prettier/prettier": "warn",
      "react/react-in-jsx-scope": "off", // Next.js sudah handle React auto-import
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
