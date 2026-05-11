import nextConfig from "eslint-config-next";

const eslintConfig = [
  {
    ignores: ["tmp/**"],
  },
  ...nextConfig,
  {
    rules: {
      // Disable strict rules from react-hooks v7 that flag pre-existing patterns
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
];

export default eslintConfig;
