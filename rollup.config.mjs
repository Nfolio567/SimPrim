import { SourceMap } from "module";
import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/simprim.ts",
    output: {
        file: "dist/simprim.min.js",
        format: "umd",
        name: "SimPrim",
        globals: {},
        sourceMap: true,
    },
    plugins: [typescript()]
}