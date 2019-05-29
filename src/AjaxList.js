import Ajax from './Ajax'
class AjaxList {
  constructor () {
    this.list = []
  }
  setAjaxFun (list, ajaxConfigs = {}, configs = {}) {
    const ajax = new Ajax(list, ajaxConfigs, configs)
    this.ajaxFun = ajax.do
  }
  add (config) {
    this.list.push(config)
  }
  run () {
    if (this.ajaxFun) {
      while (this.list.length) {
        const ajaxConfig = this.list.shift()
        this.ajaxFun(...ajaxConfig.params).then(res => {
          ajaxConfig.sucess(res)
        }).catch(e => {
          ajaxConfig.error(e)
        })
      }
    }
  }
}
export default AjaxList
