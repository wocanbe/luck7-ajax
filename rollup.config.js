import babel from 'rollup-plugin-babel'
import {uglify} from 'rollup-plugin-uglify'

const globals = {
  'axios': 'axios',
  'flyio/dist/npm/fly': 'Fly',
  'babel-runtime/core-js/promise': 'BabelCore.Promise',
  'babel-runtime/core-js/symbol': 'BabelCore.symbol',
  'babel-runtime/helpers/classCallCheck': 'BabelHelpers.classCallCheck',
  'babel-runtime/helpers/createClass': 'BabelHelpers.createClass',
  'lodash/isArray': 'isArray',
  'lodash/isFunction': 'isFunction',
  'lodash/isString': 'isString',
  'lodash/isObject': 'isObject',
  'lodash/isBoolean': 'isBoolean',
  'lodash/extend': 'extend'
}
export default {
  input: 'src/Ajax.js',
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
    } else if (/^lodash\/.*$/.test(id)) {
      return true
    } else if (/^flyio\/dist\/npm\/\w+$/.test(id)) {
      return true
    } else if (id === 'axios') {
      return true
    }
  }
}
