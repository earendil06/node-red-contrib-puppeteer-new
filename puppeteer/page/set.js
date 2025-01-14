module.exports = function (RED) {
  function PuppeteerPageSetValue (config) {
    RED.nodes.createNode(this, config)
    
    // Retrieve the config node
    this.on('input', async function (msg) {
      try {
        let selector = config.selector
        selector = config.selectortype=="msg"?msg[config.selector]:selector
        selector = config.selectortype=="flow"?flowContext.get(config.selector):selector
        selector = config.selectortype=="global"?globalContext.get(config.selector):selector
        let value = config.value
        value = config.valuetype=="msg"?msg[config.value]:value
        value = config.valuetype=="flow"?flowContext.get(config.value):value
        value = config.valuetype=="global"?globalContext.get(config.value):value
        this.status({fill:"green",shape:"dot",text:`Wait for ${selector}`});
        await msg.puppeteer.page.waitForSelector(selector)
        this.status({fill:"green",shape:"dot",text:`Setting ${selector}:${value}`});
        await msg.puppeteer.page.$eval(selector, (el,value) => el.value = value, value)
        this.status({fill:"green",shape:"ring",text:`${selector}:${value}`});
        this.send(msg) 
      } catch(e) {
        this.status({fill:"red",shape:"ring",text:e});
        this.error(e)
      }
    })
    this.on('close', function() {
      this.status({});
    });
    oneditprepare: function oneditprepare() {
      $("#node-input-name").val(this.name)
    }
  }
  RED.nodes.registerType('puppeteer-page-set-value', PuppeteerPageSetValue)
}
