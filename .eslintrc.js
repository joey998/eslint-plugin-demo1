// const eslintPluginExample = require("./eslint-plugin-example");

module.exports = {
  env: {
    node: true, // 不写会导致有一些环境自带的全局变量报错
    // browser: true
  },
  parserOptions: {
    ecmaVersion: 6, // 过低会导致一些新的特性报错，比如使用let，const会提示为保留字
  },
  root: true,
  extends: ["eslint:recommended"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
