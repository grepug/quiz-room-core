const nextConfig = {};

const withTM = require('next-transpile-modules')(['../core', '../utils']);

module.exports = withTM(nextConfig);
