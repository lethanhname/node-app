import path from "path";
import nodeExternals from "webpack-node-externals";
import { Configuration } from "webpack";
import WebpackShellPluginNext from "webpack-shell-plugin-next";
const getConfig = (
    argv: { [key: string]: string }
): Configuration => {
    return {
        entry: "./src/index.ts",
        target: "node",
        mode: argv.mode === "production" ? "production" : "development",
        externals: [nodeExternals()],
        plugins: [
            new WebpackShellPluginNext({
                onBuildStart: {
                    scripts: ["npm run clean:dev"],
                    blocking: true,
                    parallel: false,
                },
                onBuildEnd: {
                    scripts: ["npm run dev"],
                    blocking: false,
                    parallel: true,
                },
            })
        ],
        module: {
            rules: [{
                test: /\.(ts|js)$/,
                loader: "ts-loader",
                options: {},
                exclude: /node_modules/,
            }]
        },
        resolve: {
            extensions: [".ts", ".js"],
            alias: {
                src: path.resolve(__dirname, "src"),
            }
        },
        output: {
            path: path.join(__dirname, "build"),
            filename: "index.js",
        },
        optimization: {
            moduleIds: "deterministic",
            splitChunks: {
                chunks: "all",
            }
        }
    }
}

export default getConfig;