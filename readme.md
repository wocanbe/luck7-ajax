# luck7-ajax

可以拥有统一配置的项目层面的对ajax的再封装

## 参数

### config

AJAX配置，Object类型，默认值如下

```javascript
{
  list: {}, // 接口列表，格式为 别名: {method, url}
  baseURL: '', // 请求前缀
  isStrict: true, // 严格模式，详见示例
  publicParams: undefined, // 公共参数
  credentials: false, // 是否允许跨域携带cookie
}
```

### lang

错误提示文本，默认值如下

```javascript
{
  noList: '配置错误: 缺少接口配置(list)',
  methodError: '配置错误: #apiName#请求类型异常#method#',
  urlError: '配置错误: #apiName#缺少请求地址(url)',
  typeError: '使用错误: 接口参数类型错误',
  noConfig: '使用错误: 接口#apiName#未配置',
  netError: '服务器错误: 状态码：#status#'
}
```

## 使用实例

```javascript
// src/config/ajax
const list = {
  demo1: {
    url: '/mock1'
  },
  //  使用请求超时
  demo2: {
    method: 'GET', // 默认值为POST
    url: '/mock2', // 请求地址，必填且不能为空
    timeout: 1000 // 请求超时时间
  },
  // 使用URL参数（:path）
  demo3: {
    url: '/:id/mock3'
  }
}
const baseURL = {
  dev: '/mock',
  prod: ''
}
const publicParams = function () {
  const userid = sessionStorage.getItem('userid')
  const token = sessionStorage.getItem('token')
  return {userid, token}
}

export {list, baseURL, publicParams}


// src/utils/ajax.js
import isFunction from 'lodash/isFunction'
import Ajax from 'luck7-ajax'
import {list, baseURL, publicParams} from '../config/ajax'

const _ajax = new Ajax({list, baseURL, publicParams})

// 可以通过instance来拦截request和response，实现参数的加解密
const instance = _ajax.getInstance()
if (isFunction(preReq)) {
  instance.interceptors.request.use(preReq)
}
if (isFunction(preRes)) {
  instance.interceptors.response.use(preRes)
}

const ajax = function (apiName, params) {
  return _ajax.do(apiName, params)
}
export default ajax

// main.js
ajax('demo1', {
  pageNo: 1,
  size: 10
}).then((data) => {
  console.log(data)
}).catch((e) => {
  console.error(e.message)
})

Promise.all([
  ajax('demo2'),
  ajax('demo3')
]).then((datas) => {
  console.log(datas[0], datas[1])
}).catch((err) => {
  console.error(err.message)
})

ajax(
  {url: '/login'}, // 注意：这种使用方式在严格模式下回报错，只能在非严格模式下使用
  {
    username: 'admin',
    password: 'admin'
  }
).then((data) => {
  console.log(data)
}).catch((e) => {
  console.error(e.message)
})

```

