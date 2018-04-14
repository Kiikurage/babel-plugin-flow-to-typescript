# babel-plugin-flow-to-typescript

<span color="red">**Work In Progress**</span>

[Babel] plugin to convert [Flow] code into [TypeScript]

## How to use

```shell
# 1. Build

yarn install
yarn run build

# 2. Use with Babel

yarn global add @babel/core @babel/cli

# you must use babel@^7.x.x
babel --version
> 7.0.0-beta.44 (@babel/core 7.0.0-beta.44)

babel --plugins ${ABS_PATH_TO_THIS_DIR}/dist ${SRC_FLOW_FILE} -o ${DEST_TS_FILE}
```

## TODO

- [ ] add CLI
- [ ] publish to npm

[Babel]: https://github.com/babel/babel
[Flow]: https://github.com/facebook/flow
[TypeScript]: https://github.com/Microsoft/TypeScript