import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import fund from './modules/fund'
import manager from './modules/manager'
import getters from './getters'
Vue.use(Vuex)
import createPersistedState from "vuex-persistedstate"


const store = new Vuex.Store({
  modules: {
    user:user,
    fund:fund,
    manager:manager
  },
  getters,
  //存入localStorage
  plugins: [createPersistedState({
      storage: window.localStorage
  })]

})

export default store

