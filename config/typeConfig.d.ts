import * as Webpack from 'webpack';
import { Linter as Eslint } from 'eslint';
import * as Prettier from 'prettier';
// we are wrapping options inside a wrapper function to get type information
// this is a hack to force JavasScript to link TypeScript typings
export function typeWebpack(obj: Webpack.Configuration): Webpack.Configuration;
export function typeEslint(obj: Eslint.Config): Eslint.Config;
export function typePrettier(obj: Prettier.Options): Prettier.Options;
