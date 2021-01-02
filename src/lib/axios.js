import axios from 'axios'
import extend from 'lodash/extend'

class axiosAjax {
  constructor (config) {
    this.instance = axios.create(config)
    this.config = config
    this.interceptors = this.instance.interceptors
    // if (config.credentials) instance.withCredentials = true
  }
  request (reqConfig, data) {
    const axiosConfig = extend({}, reqConfig.options, {url: reqConfig.url})
    if (reqConfig.options.method === 'GET') {
      axiosConfig['params'] = data
    } else {
      axiosConfig['data'] = data
    }
    return this.instance.request(axiosConfig)
  }
}
export default axiosAjax
