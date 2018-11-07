import lang from './lang'
function checkAllowMethod (method, key) {
  if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].indexOf(method.toUpperCase()) === -1) {
    throw new Error(lang.methodError.replace('#apiName#', key).replace('#method#', method))
  }
}
function checkItem (localConfig, key) {
  if (localConfig.method) checkAllowMethod(localConfig.method, key)
  if (!localConfig.url) throw new Error(lang.urlError.replace('#apiName#', key))
  return localConfig
}
function checkList (list) {
  for (const key in list) {
    checkItem(list[key], key)
  }
  return list
}
function prefetch (url, params, isCros) {
  let urlRegx
  let baseURL = ''
  // 在请求发出之前进行一些操作
  if (isCros) {
    urlRegx = /^https?:\/\/[^:]+(:\d+)?\//i
    const ret = url.match(urlRegx)
    if (ret !== null) {
      baseURL = ret[0]
      url = url.replace(baseURL, '')
    }
  }
  urlRegx = /:(\w+)/
  let urlPat = url.match(urlRegx)
  while (urlPat !== null) {
    url = url.replace(urlPat[0], params[urlPat[1]])
    urlPat = url.match(urlRegx)
  }
  return baseURL + url
}
export {checkList, checkItem, prefetch, checkAllowMethod}
