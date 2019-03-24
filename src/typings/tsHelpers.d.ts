// Taken from http://ideasintosoftware.com/typescript-advanced-tricks/
type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type Unpacked<T> = T extends Promise<infer U> ? U : T;
