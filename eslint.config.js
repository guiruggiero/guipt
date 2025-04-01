import globals from "globals";
import js from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";
import eslintPluginYml from "eslint-plugin-yml";

export default [
  // Base JavaScript configuration
  js.configs.recommended,

  // Custom JavaScript configuration
  {
    files: ["*.js"],
    plugins: {
      js,
      "@stylistic/js": stylisticJs,
    },
    languageOptions: {
      // sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "error",
      "@stylistic/js/indent": ["warn", 2],
      "@stylistic/js/semi": "error",
      "@stylistic/js/no-extra-semi": "warn",
      "@stylistic/js/comma-spacing": ["warn", {"before": false, "after": true}],
      "@stylistic/js/comma-dangle": ["warn", "always-multiline"],
      "@stylistic/js/quotes": ["warn", "double"],
      "@stylistic/js/spaced-comment": ["warn", "always"],
      "@stylistic/js/arrow-spacing": "warn",
      "@stylistic/js/block-spacing": ["warn", "never"],
      "@stylistic/js/key-spacing": "warn",
      "@stylistic/js/keyword-spacing": "warn",
      "@stylistic/js/space-before-blocks": "warn",
      "@stylistic/js/space-before-function-paren": ["warn", "never"],
      "@stylistic/js/space-in-parens": "warn",
    },
  },

  // YAML configuration
  ...eslintPluginYml.configs["flat/standard"],
  {
    files: ["**/*.yml"],
    rules: {
      "yml/no-empty-mapping-value": "warn",
    },
  },
];