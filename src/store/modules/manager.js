const manager = {
  state: {
    id: '',
    pic:'',
    edit:1      //1表示未修改  2表示修改
  },
  mutations:{
    setManager(state,manager) {
      state.id=manager.id;
    },
    setManagerPic(state,pic) {
      state.pic=pic;
    },
    setManageredit(state,edit) {
      state.edit=edit;
    }
  }
}
export default manager
