import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/simprim.ts",
    output: [
        {
            file: "dist/simprim.min.js",
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
                        comments: false,
                    }
                })
            ],
        },
    ],
    plugins: [typescript({ tsconfig: "./tsconfig.min.json" })],
};
