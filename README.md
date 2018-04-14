# babel-plugin-flow-to-typescript

<span color="red">**Work In Progress**</span>

[Babel] plugin to convert [Flow] code into [TypeScript]

## How to use

```shell
#--------------------------------------------
# 1. Clone and Build

$ git clone https://github.com/Kiikurage/babel-plugin-flow-to-typescript
$ yarn install
$ yarn run build

#--------------------------------------------
# 2. Use with Babel

$ yarn global add @babel/core @babel/cli

# you must use babel@^7.x.x
$ babel --version 
> 7.0.0-beta.44 (@babel/core 7.0.0-beta.44)

$ babel --plugins ${ABS_PATH_TO_THIS_DIR}/dist ${SRC_FLOW_FILE} -o ${DEST_TS_FILE}
```

## Implementation status

| Supported? | Syntax | Flow | TypeScript |
|---|---|---|---|
| ❎ | Maybe type | `let a:?number` | `let a: number \| null \| undefined` |
| ❎ | Void type | `void` | `void` |
| ❎ | Mixed type | `mixed` | `{}` |
|    | Function type | `(A, B) => C` | `(a: A, b: B) => C` |
| ❎ | Exact type | `{\| a: A \|}` | `{ a: A }` |
| ❎ | Indexers | `{ [A]: B }` | `{ [a: A]: B }` |
| ❎ | Existential type | `Map<*, *>` | `Map<any, any>` |
|    | Opaque types | `opaque type A = B` | `type A = B` |
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

- [ ] add CLI
- [ ] publish to npm

[Babel]: https://github.com/babel/babel
[Flow]: https://github.com/facebook/flow
[TypeScript]: https://github.com/Microsoft/TypeScript