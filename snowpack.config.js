/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    root: "",
    plugins: [
        ['@snowpack/plugin-typescript', '--project ./tsconfig.json'],
    ],
    packageOptions: {
        // sourceMap: true,
        // installTypes: true
    },
    devOptions: {
        /* ... */
    },
    buildOptions: {
        /* ... */
        out: "lib",
        metaUrlPath: "web-modules",
        /* watch: true, */
    },
    mount: {
        "src": "/",
    },
    alias: {
        /* ... */
    },
};