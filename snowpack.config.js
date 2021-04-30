// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  root: "src",
  mount: {
    /* ... */
  },
  plugins: [
    ['@snowpack/plugin-typescript', {
      tsc: 'tsc',
      args: '--project ../tsconfig.json'
    }],
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
    port: 8888
  },
  buildOptions: {
    /* ... */
    out: "dist",
    watch: true,
  }
};