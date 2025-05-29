import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/simprim.ts",
    output: {
        file: "dist/simprim-1.1.3.js",
        format: "umd",
        name: "SimPrim",
        globals: {},
        sourceMap: true,
        banner: "/*! SimPrim - Simple Image Trimming Library v1.1.3 | (c) Nfolio | ISC | https://github.com/Nfolio567/SimPrim */",
    },
    plugins: [typescript()]
}