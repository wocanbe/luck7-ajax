import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import isBoolean from 'lodash/isBoolean'
import extend from 'lodash/extend'
import defaultLang from './lib/lang'
import {checkList, checkAllowMethod, getAjaxConfig} from './lib/tools'
import LyAjax from './lib/flyio'

const ajaxList = Symbol('api')
const methodList = Symbol('method')
const strictMode = Symbol('mode')

function single (apis, methods, isStrict, instance, apiName, params) {
  const filterFun = methods[apiName] || methods['_']
  const reqConfig = getAjaxConfig(apiName, params, apis[apiName], isStrict, instance.config.method)
  if (reqConfig instanceof Error) return Promise.reject(reqConfig)
  let sucessFun, errorFun
  if (isFunction(filterFun)) {
    const filterObj = filterFun()
    if (isFunction(filterObj)) {
      sucessFun = filterObj
    } else {
      if (filterObj.request) filterObj.request(reqConfig)
      if (filterObj.response) sucessFun = filterObj.response
      if (filterObj.error) errorFun = filterObj.error
    }
  }
  return instance.request(reqConfig).then((res) => {
    if (res.status === 200) {
      try {
        const data = sucessFun ? sucessFun(res.data) : res.data
        return data
      } catch (e) {
        throw e
      }
    } else {
      // 捕捉2XX(除200),304之类的返回
      throw new Error(defaultLang.netError.replace('#status#', res.status))
    }
  }).catch((err) => {
    if (errorFun) errorFun(err)
    else throw err
  })
}
class Ajax {
  constructor () {
    if (arguments[0] instanceof Promise) {
      arguments[0].then(res => {
        this.init(res, arguments[1], arguments[2], arguments[3])
      })
    } else {
      this.init(...arguments)
      if (arguments[0].init) this.do('init', {})
    }
  }
  init (apiList, ajaxConfigs = {}, configs = {}, apiMethods = {}) {
    if (isObject(configs.lang)) {
      for (const key in configs.lang) {
        if (defaultLang[key]) defaultLang[key] = configs.lang[key]
      }
    }
    this[strictMode] = isBoolean(configs.isStrict) ? configs.isStrict : true

    if (ajaxConfigs.method) {
      ajaxConfigs.method = ajaxConfigs.method.toUpperCase()
      checkAllowMethod(ajaxConfigs.method, '')
    }
    if (apiList) this[ajaxList] = checkList(apiList)
    else throw new Error(defaultLang.noList)

    this[methodList] = apiMethods

    const instance = new LyAjax(extend({method: 'POST'}, ajaxConfigs))
    this.instance = instance
  }
  do (apiName, params) {
    if (isArray(apiName)) {
      const ajaxReqs = []
      for (var s in apiName) {
        ajaxReqs.push(single(this[ajaxList], this[methodList], this[strictMode], this.instance, apiName[s], params[s]))
      }
      return Promise.all(ajaxReqs)
    } else return single(this[ajaxList], this[methodList], this[strictMode], this.instance, apiName, params)
  }
}
export default Ajax
