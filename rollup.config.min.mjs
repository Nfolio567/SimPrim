import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/simprim.ts",
    output: [
        {
            file: "dist/simprim-1.1.1.min.js",
            format: "iife",
            name: "SimPrim",
            plugins: [
                terser({
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                        passes: 3,
                        toplevel: true,
                    },
                    mangle: {
                        toplevel: true,
                        properties: {
                            regex: /^_/
                        }
                    },
                    format: {
                        beautify: false,
                    }
                })
            ],
            banner: "/*! SimPrim - Simple Image Trimming Library v1.1.1 | (c) Nfolio | ISC | https://github.com/Nfolio567/SimPrim */",
        },
    ],
    plugins: [typescript({ tsconfig: "./tsconfig.min.json" })],
};
