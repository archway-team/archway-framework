import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

import * as path from "path";
import * as fs from "fs";

const distname = "./dist";
const pkgname = "./pkg";

let plugins = [];
let builds = [];

function format(path) {
  return "./" + path.split("\\").join("/");
}

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

/* archway-framework */
let archjs = path.join(distname, "cjs", "index.js");
let archmjs = path.join(distname, "esm", "index.mjs");

builds.push({
  input: "index.js",
  output: [
    {
      file: archjs,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: archmjs,
      format: "es",
      sourcemap: true,
    },
  ],
  plugins,
  external: ["http", "https"],
});

export default builds;
