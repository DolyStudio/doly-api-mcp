// build.js
import { build } from "esbuild";

// ES 모듈에서 __dirname 대체

try {
  await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    target: "node18",
    format: "cjs",
    outfile: "dist/index.cjs",
    external: ["path", "fs", "crypto", "util", "os"],
    packages: "bundle", // 모든 의존성을 번들에 포함
    sourcemap: false,
    minify: false,
    logLevel: "info",
  });

  console.log("번들링 완료! dist/index.cjs 생성됨");
} catch (error) {
  console.error("번들링 실패:", error);
  process.exit(1);
}
