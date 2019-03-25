// Taken from http://ideasintosoftware.com/typescript-advanced-tricks/
type Diff<T extends string | number | symbol, U extends string | number | symbol> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];
type Unpacked<T> = T extends Promise<infer U> ? U : T;

type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
