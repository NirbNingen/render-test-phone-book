/* eslint-disable */

import globals from "globals";
import stylisticJs from "@stylistic/eslint-plugin-js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // stylisticJs.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      // sourceType: "commonjs",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
    },
    plugins: {
      "@stylistic/js": stylisticJs,
    },
    rules: {
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["error", "single"],
      "@stylistic/js/semi": ["error", "never"],
      "no-console": "off",
    },
  },
  {
    ignores: ["**/dist/**", "build/**"],
  },
];
