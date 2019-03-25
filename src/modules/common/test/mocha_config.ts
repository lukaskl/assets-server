/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from 'chalk';
import path from 'path';
import '../../routes.tsoa';

function getPath(): string {
  const stack = new Error().stack;
  const lines = stack.split('\n');
  const srcDirString = `${path.sep}src${path.sep}`;
  const line = lines.filter(x => x.includes(srcDirString)).filter(x => !x.includes('mocha_config.ts'))[0];

  const lastIndex = line.lastIndexOf(srcDirString);
  const substr =
    '.' +
    line
      .substring(lastIndex)
      .replace(')', ' ')
      .replace(/\\/g, '/');
  return substr;
}

function traceFunction(functionName: 'it' | 'describe'): void {
  const originalFunction = global[functionName];

  (global[functionName] as any) = function(title: string, fn: any) {
    return originalFunction(title + chalk.black('     ' + getPath()), fn);
  };
  global[functionName] = Object.assign(global[functionName], originalFunction);
}

traceFunction('it');
traceFunction('describe');
