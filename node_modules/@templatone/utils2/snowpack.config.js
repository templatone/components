/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    root: "",
    plugins: [
        '@snowpack/plugin-typescript',
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
        out: "dist",
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