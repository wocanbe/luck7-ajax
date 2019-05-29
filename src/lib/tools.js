import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import extend from 'lodash/extend'
import lang from './lang'

function checkAllowMethod (method, key) {
  if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'].indexOf(method) === -1) {
    throw new Error(lang.methodError.replace('#apiName#', key).replace('#method#', method))
  }
}
function checkItem (localConfig, key) {
  if (isString(localConfig)) localConfig = {url: localConfig}
  if (localConfig.method) {
    localConfig.method = localConfig.method.toUpperCase()
    checkAllowMethod(localConfig.method, key)
  }
  if (!localConfig.url) throw new Error(lang.urlError.replace('#apiName#', key))
  return localConfig
}
function checkList (list) {
  for (const key in list) {
    list[key] = checkItem(list[key], key)
  }
  return list
}
function prefetch (url, params, isCros) {
  let urlRegx
  let domain = ''
  // 在请求发出之前进行一些操作
  if (isCros) {
    urlRegx = /^https?:\/\/[^:]+(:\d+)?\//i
    const ret = url.match(urlRegx)
    if (ret !== null) {
      domain = ret[0]
      url = url.replace(domain, '')
    }
  }
  urlRegx = /:(\w+)/
  let urlPat = url.match(urlRegx)
  while (urlPat !== null) {
    if (params.hasOwnProperty(urlPat[1])) {
      url = url.replace(urlPat[0], params[urlPat[1]])
    } else {
      throw new Error(urlPat[1])
    }
    urlPat = url.match(urlRegx)
  }
  return domain + url
}

function getAjaxConfig (apiName, params, apiConfig, strictMode, defaultMethod) {
  let localConfig
  if (isString(apiName)) {
    if (apiConfig) localConfig = apiConfig
    else if (strictMode) return new Error(lang.noConfig.replace('#apiName#', apiName))
    else localConfig = {url: apiName}
  } else {
    if (strictMode) return new Error(lang.typeError)
    if (isObject(apiName)) localConfig = checkItem(apiName, '')
    else return new Error(lang.typeError)
  }
  const reqConfig = {
    url: localConfig.url,
    data: extend({}, localConfig.data, params),
    options: {}
  }
  reqConfig.options = extend({}, localConfig.options, {
    method: localConfig.method || defaultMethod
  })
  if (isObject(params)) {
    try {
      reqConfig.url = prefetch(localConfig.url, params, localConfig.isCros)
    } catch (e) {
      return new Error(lang.paramError.replace('#param#', e.message))
    }
  }
  return reqConfig
}

export {checkList, checkAllowMethod, getAjaxConfig}
