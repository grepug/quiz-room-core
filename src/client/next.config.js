const nextConfig = {};

const withTM = require('next-transpile-modules')([
  '../core',
  '../utils',
  'quiz-room-utils',
  'quiz-room-core',
]);

module.exports = withTM(nextConfig);
