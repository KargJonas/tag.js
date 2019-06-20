import json from "rollup-plugin-json";
import { terser } from "rollup-plugin-terser";

export default {
    input: "src/tag.js",
    plugins: [
        json(),
        terser()
    ],
    output: {
        file: "dist/tag.min.js",
        format: "iife",
        name: "tag",
        sourcemap: process.argv.includes("-w") ? "inline" : false
    }
};