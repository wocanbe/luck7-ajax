import Fly from 'flyio/dist/npm/fly'
import extend from 'lodash/extend'

// flyio/dist/npm/fly flyio/dist/npm/wx flyio/dist/npm/hap flyio/dist/npm/weex

class FlyAjax {
  constructor (config) {
    const ajax = new Fly()
    ajax.config = extend({parseJson: true}, config)
    this.instance = ajax
    this.config = config
    this.interceptors = ajax.interceptors
  }
  request (reqConfig) {
    return this.instance.request(reqConfig.url, reqConfig.data, reqConfig.options)
  }
}
export default FlyAjax
