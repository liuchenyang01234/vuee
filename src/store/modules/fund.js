const fund = {
  state: {
    id: '',
  },
  mutations:{
    setfund(state,fund) {

      state.id = null;
      state.id=fund.id;
      console.log("state.id");
      console.log(state.id);

    }
  },
  actions:{
    setfund(context,fund) {
      // 必须重置数据 才能更新get
      context.commit('setfund',fund)
    }
  }
}
export default fund
