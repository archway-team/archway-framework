import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

import * as path from "path";

const distname = "./dist";
const pkgname = "./pkg";

let plugins = [];
let builds = [];

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
builds.push({
  input: "index.js",
  output: [
    {
      file: path.join(distname, "core/cjs", "index.js"),
      format: "cjs",
      sourcemap: true,
    },
    {
      file: path.join(distname, "core/esm", "index.mjs"),
      format: "es",
      sourcemap: true,
    },
  ],
  plugins,
  external: ["http", "https"],
});

/* archway/pkgs */
const pkgs = ["html", "navigation"];

for (const pkg of pkgs) {
  builds.push({
    input: path.join(pkgname, pkg, "index.js"),
    output: [
      {
        file: path.join(distname, pkg, "cjs", "index.js"),
        format: "cjs",
        sourcemap: true,
      },
      {
        file: path.join(distname, pkg, "esm", "index.mjs"),
        format: "es",
        sourcemap: true,
      },
    ],
    plugins,
    external: ["http", "https"],
  });
}

export default builds;
