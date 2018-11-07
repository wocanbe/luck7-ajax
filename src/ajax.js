import axios from 'axios'
import isFunction from 'lodash/isFunction'
import isBoolean from 'lodash/isBoolean'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import extend from 'lodash/extend'
import defaultLang from './lang'
import {checkList, checkItem, prefetch, checkAllowMethod} from './tools'
class Ajax {
  constructor (list, axiosConfigs = {}, configs = {}) {
    if (isObject(configs.lang)) {
      for (const key in configs.lang) {
        if (defaultLang[key]) defaultLang[key] = configs.lang[key]
      }
    }

    if (axiosConfigs.method) checkAllowMethod(axiosConfigs.method, '')
    if (list) this.list = checkList(list)
    else throw new Error(defaultLang.noList)

    this.isStrict = isBoolean(configs.isStrict) ? configs.isStrict : true
    this.publicParams = isFunction(configs.publicParams) ? configs.publicParams : undefined
    this.instance = axios.create(extend({method: 'POST'}, axiosConfigs))
  }
  do (apiName, params) {
    let localConfig
    if (isString(apiName)) {
      localConfig = this.list[apiName]
      if (!localConfig) {
        return Promise.reject(new Error(defaultLang.noConfig.replace('#apiName#', apiName)))
      }
    } else if (this.isStrict) {
      return Promise.reject(new Error(defaultLang.typeError))
    } else if (isObject(apiName)) {
      localConfig = checkItem(apiName, '')
    } else {
      return Promise.reject(new Error(defaultLang.typeError))
    }
    const reqConfig = {
      url: localConfig.url,
      method: localConfig.method || this.instance.defaults.method
    }
    if (localConfig.timeout) extend(reqConfig, {timeout: localConfig.timeout})
    let useParams = params
    if (isObject(params)) {
      if (this.publicParams) useParams = extend({}, this.publicParams(), params)
      reqConfig.url = prefetch(localConfig.url, useParams, localConfig.isCros)
    }
    if (reqConfig.method.toUpperCase() === 'GET') {
      extend(reqConfig, {params: useParams})
    } else {
      extend(reqConfig, {data: useParams})
    }
    return new Promise((resolve, reject) => {
      this.instance.request(reqConfig).then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(new Error(defaultLang.netError.replace('#status#', res.status)))
        }
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
export default Ajax
