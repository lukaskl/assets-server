/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
// This is a fork of a library: https://github.com/abstiles/webpack-karma-die-hard
// The fork was necessary to support treating errors as warning on the CI environment

'use strict';

var chalk = require('chalk');
var path = require('path');

function TreatWarningsAsErrors() {}

function Output(mesage, errors, color) {
  // Need to report warnings and errors manually, since these will not bubble
  // up to the user.
  errors.forEach(function(warning) {
    if (errors.module) {
      console.warn(color(mesage + path.relative('', errors.module.resource)));
    }
    console.warn(color(errors.message || errors));
  });
}

function Break(stats) {
  const containsErrors = stats.compilation.warnings.length > 0 || stats.compilation.errors.length > 0;

  const isCI = process.env.CI && (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false');

  if (containsErrors && isCI) {
    console.log(
      chalk.yellow(
        '\nTreating warnings as errors because process.env.CI = true.\n' + 'Most CI servers set it automatically.\n',
      ),
    );

    Output('WARNING: ./', stats.compilation.warnings, chalk.yellow);
    Output('ERROR: ./', stats.compilation.errors, chalk.red);
    process.exit(1);
  }
}

TreatWarningsAsErrors.prototype.apply = function(compiler) {
  compiler.plugin('done', Break);
};

module.exports = TreatWarningsAsErrors;
