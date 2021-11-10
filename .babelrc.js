module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        loose: true,
      },
    ],
    "@babel/preset-react",
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
};
