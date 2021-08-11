interface api {
  method?:string, // 默认值为POST
  url:string, // 请求地址，必填且不能为空
  data?: any, // 请求参数，可以进行一些特殊写法，如写成'vuex.xxxx'，然后在methods中处理成对应的vuex数据
  options?: any
}
interface apiList {
  [propName:string]:string|api
}
interface lang {
  noList?:string,
  methodError?:string,
  urlError?:string,
  typeError?:string,
  noConfig?:string,
  netError?:string
}
interface ajaxConfig {
  isStrict?:boolean
  lang?:lang
}
interface methodFun {
  request?(req:[AxiosRequestConfig,any]):[AxiosRequestConfig,any], // 对request参数进行处理，返回处理后的请求参数
  response?(responseData:any):any|Promise<any>, // 对返回数据进行处理，返回处理后的数据(也可以在这儿交由vuex处理，返回空对象)
  error?(err:Error)
}
interface apiMethod {
  [propName:string]:() => methodFun
}
declare class Luck7Ajax {
  constructor(apiList:apiList, commonConfigs:AxiosRequestConfig, ajaxConfig:ajaxConfig, apiMethods:apiMethod);
  init (apiList:apiList, ajaxConfig:ajaxConfig, configs:AxiosRequestConfig, apiMethods:apiMethod);
  do (apiName:string|api, params:any);
}
export = Luck7Ajax