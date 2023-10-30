const fooBarRule = require("./enforce-foo-bar");
const equidistance = require('./equidistance');
const plugin = { rules: { "enforce-foo-bar": fooBarRule, 'equidistance': equidistance } };
module.exports = plugin;