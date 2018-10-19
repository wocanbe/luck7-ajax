import axios from 'axios'
import isFunction from 'lodash/isFunction'
import isBoolean from 'lodash/isBoolean'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import extend from 'lodash/extend'
import defaultLang from './lang'
import {preCheck, preCheckItem, prefetch} from './tools'
class Ajax {
  constructor (configs = {list: {}, credentials: false}, lang) {
    if (isObject(lang)) {
      for (const key in lang) {
        if (defaultLang[key]) defaultLang[key] = lang[key]
      }
    }
    if (configs.list) this.list = preCheck(configs.list)
    else throw new Error(defaultLang.noList)
    const instance = axios.create()
    let useURL = ''
    if (isString(configs.baseURL)) {
      if (process.env.NODE_ENV !== 'development') useURL = configs.baseURL
    } else if (isObject(configs.baseURL)) {
      if (process.env.NODE_ENV === 'development') {
        if (configs.baseURL.dev) useURL = configs.baseURL.dev
      } else {
        useURL = configs.baseURL.prod || ''
      }
    }
    instance.defaults.baseURL = useURL

    this.isStrict = isBoolean(configs.isStrict) ? configs.isStrict : true
    this.publicParams = isFunction(configs.publicParams) ? configs.publicParams : undefined
    // 扩展跨域支持
    if (configs.credentials) instance.withCredentials = true
    this.instance = instance
  }
  getInstance () {
    return this.instance
  }
  do (apiName, params) {
    return new Promise((resolve, reject) => {
      let localConfig
      if (isString(apiName)) {
        localConfig = this.list[apiName]
        if (!localConfig) {
          reject(new Error(defaultLang.noConfig.replace('#apiName#', apiName)))
          return
        }
      } else if (this.isStrict) {
        reject(new Error(defaultLang.typeError))
        return
      } else if (isObject(apiName)) {
        localConfig = preCheckItem(apiName, '')
      } else {
        reject(new Error(defaultLang.typeError))
        return
      }
      // const cancelToken = CancelToken.source()
      // cancelTokens.push(cancelToken.cancel)
      const reqConfig = {
        url: localConfig.url,
        // cancelToken: cancelToken.token,
        // cancelToken: new CancelToken(c => {
        //   cancelTokens.push(c)
        // }),
        method: localConfig.method
      }
      if (localConfig.timeout) extend(reqConfig, {timeout: localConfig.timeout})
      let useParams = params
      if (isObject(params)) {
        if (this.publicParams) useParams = extend({}, this.publicParams(), params)
        reqConfig.url = prefetch(localConfig.url, useParams, localConfig.isCros)
      }
      if (localConfig.method === 'GET') {
        extend(reqConfig, {params: useParams})
      } else {
        extend(reqConfig, {data: useParams})
      }
      this.instance.request(reqConfig).then((res) => {
        let status = res.status
        let data = res.data
        if (status === undefined) {
          status = res.response.status
          data = res.response.data
        }
        if (status === 200) {
          resolve(data)
        } else {
          reject(new Error(defaultLang.netError.replace('#status#', status)))
        }
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
export default Ajax
