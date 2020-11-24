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
  return "./" + path.split("\\").join("/")
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

/* package.json */
let _package = JSON.parse(fs.readFileSync("./package.json"));

/* archway-framework */
let archjs = path.join(distname, "core/cjs", "index.js");
let archmjs = path.join(distname, "core/esm", "index.mjs");

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
_package.exports["."] = {
  "require": format(archjs),
  "default": format(archmjs),
};

/* archway/pkgs */
const pkgs = ["html", "navigation"];
for (const pkg of pkgs) {
  let pkgjs = path.join(distname, pkg, "cjs", "index.js");
  let pkgmjs = path.join(distname, pkg, "esm", "index.mjs");

  builds.push({
    input: path.join(pkgname, pkg, "index.js"),
    output: [
      {
        file: pkgjs,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: pkgmjs,
        format: "es",
        sourcemap: true,
      },
    ],
    plugins,
    external: ["http", "https"],
  });

  _package.exports["./" + pkg] = {
    "require": format(pkgjs),
    "default": format(pkgmjs)
  }
}

fs.writeFileSync("package.json", JSON.stringify(_package, null, 2));

export default builds;
