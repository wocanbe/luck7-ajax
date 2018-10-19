import lang from './lang'
function preCheckItem (localConfig, key) {
  if (localConfig.method) {
    const method = localConfig.method.toUpperCase()
    if (['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) === -1) {
      throw new Error(lang.methodError.replace('#apiName#', key).replace('#method#', localConfig.method))
    } else {
      localConfig.method = method
    }
  } else {
    localConfig['method'] = 'POST'
  }
  if (!localConfig.url) {
    throw new Error(lang.urlError.replace('#apiName#', key))
  }
  return localConfig
}
function preCheck (list) {
  for (const key in list) {
    preCheckItem(list[key], key)
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
export {preCheck, preCheckItem, prefetch}
