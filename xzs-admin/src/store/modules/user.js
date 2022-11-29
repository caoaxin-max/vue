import Cookies from 'js-cookie'
import userApi from '@/api/user'
// initial state
const state = {
  userName: Cookies.get('adminUserName'),
  userInfo: Cookies.get('adminUserInfo'),
  userToken: Cookies.get('Authorization')
}

// actions
const actions = {
  initUserInfo ({ commit }) {
    return new Promise(resolve =>{
      userApi.getCurrentUser().then(re => {
        commit('setUserInfo', re.data)
        resolve(re.data)
      })
    })
  }
}

// mutations
const mutations = {
  setToken(state, token, expires){
    state.token = token
    Cookies.set('Authorization', token, { expires: expires })
  },
  setUserName (state, userName) {
    state.userName = userName
    Cookies.set('adminUserName', userName, { expires: 30 })
  },
  setUserInfo: (state, userInfo) => {
    state.userInfo = userInfo
    Cookies.set('adminUserInfo', userInfo, { expires: 30 })
  },
  clearLogin (state) {
    Cookies.remove('adminUserName')
    Cookies.remove('adminUserInfo')
    Cookies.remove('Authorization')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
