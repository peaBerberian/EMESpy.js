// rollup.config.js
import babel from "rollup-plugin-babel";

export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "EMESpy",
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};
