import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

import * as path from "path";

const dist = path.resolve("./dist");

let plugins = [];

plugins.push(
  ...[
    json(),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
  ]
);

if (!("dev" == (process.env.mode && process.env.mode.toLowerCase()))) {
  plugins.push(
    ...[
      terser({
        compress: {
          arrows: false,
          keep_classnames: true,
          keep_fnames: true,
          keep_infinity: true,
          typeofs: false,
        },
        keep_classnames: true,
        keep_fnames: true,
      }),
    ]
  );
}

export default {
  input: path.join("index.js"),
  output: [
    {
      file: path.join(dist, "cjs", "bundle.js"),
      format: "cjs",
      sourcemap: true,
    },
    {
      file: path.join(dist, "esm", "bundle.js"),
      format: "es",
      sourcemap: true,
    },
  ],
  plugins,
  external: ["http", "https"],
};
