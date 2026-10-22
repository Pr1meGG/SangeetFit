import nextVitals from "eslint-config-next/core-web-vitals";

export default [
  ...nextVitals,
  { ignores: [".next/**", ".next-dev/**", "out/**", "branding/**", "next-env.d.ts"] },
  // Existing effects use deliberate state synchronization; React Compiler is not enabled.
  { rules: { "react-hooks/set-state-in-effect": "off", "react-hooks/refs": "off" } },
];
