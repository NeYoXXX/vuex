export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    // 覆盖 init 并注入 vuex init 过程以实现 1.x 向后兼容性。
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   * Vuex 初始化钩子，注入到每个实例的init hooks 列表中。
   * 目的：在this.$store=options.store也就是在每个组件中的实例声明$store的属性，值为根组件的store属性。
   */
  function vuexInit () {
    const options = this.$options
    // store injection
    // 从根组件开始，会通过options.parent.$store的方式一直注册到最后一个组件
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
