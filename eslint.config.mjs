import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = tseslint.config(
  {
    name: "settings",
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },
  {
    name: "ignores",
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/public/**",
      "**/.next/**",
      "**/.turbo/**",
    ],
  },
  {
    name: "prettier",
    ...eslintConfigPrettier,
  },
  {
    name: "typescript-logic",
    files: ["**/*.ts", "**/*.tsx"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strict,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    plugins: {
      "unused-imports": unusedImports,
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "import/no-unresolved": ["error", { ignore: ["^geist"] }],
      "no-void": ["error", { allowAsStatement: true }],
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.test.ts",
            "**/*.test.tsx",
            "**/*.stories.tsx",
            "**/*.stories.ts",
            "**/*.config.ts",
            "**/*.config.mjs",
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          argsIgnorePattern: "_",
          ignoreRestSiblings: false,
          varsIgnorePattern: "_",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ForInStatement",
          message: "Use Object.entries() instead.",
        },
        {
          selector: "TSEnumDeclaration",
          message: "Use type instead.",
        },
        {
          selector: "WithStatement",
        },
      ],
      "unicorn/prefer-switch": [
        "error",
        { emptyDefaultCase: "no-default-case" },
      ],
    },
  },
  {
    name: "typescript-style",
    files: ["**/*.ts", "**/*.tsx"],
    extends: [...tseslint.configs.stylistic],
    rules: {
      "prefer-template": "error",
      "no-console": "warn",
      "arrow-body-style": ["error", "as-needed"],
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: "return",
        },
      ],
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
          js: "never",
          jsx: "never",
        },
      ],
    },
  },
  {
    name: "react",
    files: ["**/*.ts", "**/*.tsx"],
    settings: { 
      react: { version: "detect" }
    },
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "react/require-default-props": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "off",
      "react/jsx-no-bind": "off",
      "react/prop-types": "off",
      "react/no-unknown-property": "error",
      "react-hooks/exhaustive-deps": "error",
      "react/jsx-sort-props": "off",
      "react/jsx-filename-extension": [
        "error",
        {
          extensions: [".jsx", ".tsx"],
        },
      ],
      // UI library specific rules
      "jsx-a11y/no-autofocus": "off", // UI libraries may need autofocus for UX
      "jsx-a11y/anchor-has-content": "off", // Link components may have content via children
      "jsx-a11y/heading-has-content": "off", // Heading components may have content via children
      "import/no-named-as-default": "warn", // Reduce to warning for clsx
    },
  }
);

export default eslintConfig;
