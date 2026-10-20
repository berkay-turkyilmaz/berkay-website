import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Mount-time localStorage loads and prop/route syncs are intentional (SSR-safe hydration).
      // Kept visible as warnings so new cases are still reviewed.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
