declare module Chai {
  export interface Assertion {
    containSubset(obj: {}): void;
  }
}
