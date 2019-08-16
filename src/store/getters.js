
const getters = {
  id: state => state.user.id,
  token: state => state.user.token,
  name: state => state.user.name,
  /*role: state => state.user.role,*/
  fid:state => state.fund.id,
  mid:state => state.manager.id,
  mpic:state => state.manager.pic,
  medit:state => state.manager.edit,
}
export default getters
