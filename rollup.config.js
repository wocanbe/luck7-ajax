import babel from 'rollup-plugin-babel'
import {uglify} from "rollup-plugin-uglify"

const globals = {
  'axios': 'axios',
  'babel-runtime/core-js/promise': 'BabelCore.Promise',
  'babel-runtime/helpers/classCallCheck': 'BabelHelpers.classCallCheck',
  'babel-runtime/helpers/createClass': 'BabelHelpers.createClass',
  'lodash/isFunction': 'isFunction',
  'lodash/isBoolean': 'isBoolean',
  'lodash/isString': 'isString',
  'lodash/isObject': 'isObject',
  'lodash/extend': 'extend'
}
export default {
  input: 'src/ajax.js',
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    name: 'luck7-ajax',
    globals,
    banner: '/**\n* Copyright 584069777@qq.com 2018.\n*/'
  },
  // plugins: [babel({runtimeHelpers: true})],
  plugins: [babel({
    babelrc: false,
    runtimeHelpers: true,
    'presets': [
      [require.resolve('babel-preset-env'), {modules: false}]
    ],
    plugins: [require.resolve('babel-plugin-transform-runtime')],
    'comments': true
  }), uglify()],
  external: (id) => {
    if (/^babel-runtime\/.*$/.test(id)) {
      return true
    } else if (/^(axios|lodash\/.*)$/.test(id)) {
      return true
    }
  }
}
