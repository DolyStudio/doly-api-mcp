import sharedConfig from "@repo/shared/rollup.config.js";

export default {
  ...sharedConfig,
  input: ["src/bedrock.ts"],
};
