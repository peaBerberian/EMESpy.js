import { babel } from "@rollup/plugin-babel";

export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "EMESpy",
  },
  plugins: [
    // only transpile our source code
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
  ],
};
