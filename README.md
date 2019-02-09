# babel-plugin-flow-to-typescript

[Babel] plugin to convert [Flow] code into [TypeScript]

## How to use

```shell
$ yarn global add @babel/cli 
$ yarn add babel-plugin-flow-to-typescript

# you must use babel@^7.x.x
$ babel --version 
7.0.0-beta.44 (@babel/core 7.0.0-beta.44)

$ babel --plugins babel-plugin-flow-to-typescript ${SRC_FLOW_FILE} -o ${DEST_TS_FILE}
```

## Implementation status

| Supported? | Syntax | Flow | TypeScript |
|---|---|---|---|
| ❎ | Maybe type | `let a:?number` | `let a: number \| null \| undefined` |
| ❎ | Void type | `void` | `void` |
| ❎ | Mixed type | `mixed` | `{}` |
| ❎ | Object type | `Object` | `object` |
| ❎ | Function type | `(A, B) => C` | `(x1: A, x2: B) => C` |
| ❎ | Exact type | `{\| a: A \|}` | `{ a: A }` |
| ❎ | Indexers | `{ [A]: B }` | `{ [a: A]: B }` |
| ❎ | Existential type | `Map<*, *>` | `Map<any, any>` |
| ❎ | Opaque types | `opaque type A = B` | `type A = B` |
| ❎ | Variance | `interface A { +b: B, -c: C }` | `interface A { readonly b: B, c: C }` |
| ❎ | Type parameter bounds | `function f<A: string>(a:A){}` | `function f<A extends string>(a:A){}` |
| ❎ | Cast | `(a: A)` | `(a as A)` |
| ❎ | type/typeof import | `import type A from 'module'` | `import A from 'module'` |
| ❎ | $Keys | `$Keys<X>` | `keyof X` |
| ❎ | $Values | `$Values<X>` | `X[keyof X]` |
| ❎ | $ReadOnly | `$Readonly<X>` | `Readonly<X>` |
| ❎ | $Exact| `$Exact<X>` | `X` |
| ❎ | $Diff| `$Diff<X, Y>` | `Pick<X, Exclude<keyof X, keyof Y>>` |
| ❎ | $PropertyType| `$PropertyType<T, k>` | `T[k]` |
| ❎ | $ElementType| `$ElementType<T, k>` | `T[k]` |
| ❎ | typeof operator| `typeof foo` | `typeof foo` |
| ❎ | JSX | - | - |
| ❎ | Tuple type | `[number, string]` | `[number, string]` |
| ❎ | Exact type | `{|a: T|}` | `{a: T}` |
| ❎ | Type alias | `type A = string` | `type A = string` |


[Babel]: https://github.com/babel/babel
[Flow]: https://github.com/facebook/flow
[TypeScript]: https://github.com/Microsoft/TypeScript