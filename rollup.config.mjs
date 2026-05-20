import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

const dev = process.env.ROLLUP_WATCH === "true";

export default {
  input: "src/ha-schedule-card.ts",
  output: {
    file: "dist/ha-schedule-card.js",
    format: "es",
    sourcemap: dev,
    inlineDynamicImports: true,
  },
  plugins: [
    resolve({ browser: true }),
    json({ compact: true }),
    typescript({
      tsconfig: "./tsconfig.json",
      noEmitOnError: !dev,
    }),
    !dev &&
      terser({
        format: { comments: false },
        ecma: 2022,
        compress: { passes: 2 },
        mangle: { reserved: ["HomeAssistant"] },
      }),
  ].filter(Boolean),
  onwarn(warning, warn) {
    // Lit decorators trigger this warning under Rollup — safe to ignore
    if (warning.code === "THIS_IS_UNDEFINED") return;
    warn(warning);
  },
};
