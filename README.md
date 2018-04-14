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
| [x] | Maybe type | `let a:?number` | `let a: number | null | undefined` |
| [x] | Void type | `void` | `void` |
| [x] | Mixed type | `mixed` | `{}` |
| [ ]  | Function type | `(A, B) => C` | `(a: A, b: B) => C` |
| [x]  | Exact type | `{| a: A |}` | `{ a: A }` |
| [x]  | Indexers | `{ [A]: B }` | `{ [a: A]: B }` |
| [x]  | Existential type | `Map<*, *>` | `Map<any, any>` |
| [ ] | Opaque types | `opaque type A = B` | `type A = B` |
| [ ] | Variance | `interface A { +b: B, -c: C }` | `interface A { readonly b: B, c: C }` |
| [x] | Type parameter bounds | `function f<A: string>(a:A){}` | `function f<A extends string>(a:A){}` |
| [x] | Cast | `(a: A)` | `(a as A)` |
| [x] | type/typeof import | `import type A from 'module'` | `import A from 'module'` |
| [x] | $Keys | `$Keys<X>` | `keyof X` |
| [x] | $Values | `$Values<X>` | `X[keyof X]` |
| [x] | $ReadOnly | `$Readonly<X>` | `Readonly<X>` |
| [x] | $Exact| `$Exact<X>` | `X` |
| [x] | $Diff| `$Diff<X, Y>` | `Pick<X, Exclude<keyof X, keyof Y>>` |
| [x] | $PropertyType| `$PropertyType<T, k>` | `T[k]` |
| [x] | $ElementType| `$ElementType<T, k>` | `T[k]` |

- [ ] add CLI
- [ ] publish to npm

[Babel]: https://github.com/babel/babel
[Flow]: https://github.com/facebook/flow
[TypeScript]: https://github.com/Microsoft/TypeScript