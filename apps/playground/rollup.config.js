import commonjs from "@rollup/plugin-commonjs"; // 추가 필요
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve"; // 추가 필요
import typescript from "@rollup/plugin-typescript";

export default {
  input: ["src/index.ts"],
  output: {
    dir: "dist",
    format: "es",
  },
  plugins: [json(), typescript(), nodeResolve(), commonjs()],
  exclude: ["node_modules", "__test__", "package*.json"],
  external: ["express", "cors", "helmet", "morgan"],
};
