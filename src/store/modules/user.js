const user = {
  state: {
    id: new Number,
    token:'',
    name: '',
   /* role: ''*/
  },
  mutations:{
     setuser(state,admintoken) {
        state.id=admintoken.id;
        state.token=admintoken.token;
        state.name=admintoken.name;
    /*    if(admintoken.role!=null)
        state.role=admintoken.role.name;*/
     }


  }
}
export default user
