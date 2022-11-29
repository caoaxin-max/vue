import { constantRoutes } from "@/router";
import Cookies from "js-cookie";
import menuApi from "@/api/menu";
import { getAsyncRoutes } from "@/utils/asyncRouter";

let state = {
  routes: constantRoutes,
};

const mutations = {
  initRoutes: (state, routes) => {
    state.routes = routes;
  },
};

const actions = {
  addAsyncRoutes({ commit }) {
    return new Promise((resolve) => {
      let userInfo = JSON.parse(Cookies.get("adminUserInfo"));
      menuApi.getMenu(userInfo.role).then((res) => {
        let accessRoutes = getAsyncRoutes(res.data)
        let routes = constantRoutes.concat(accessRoutes)
        commit('initRoutes',routes)
        resolve(accessRoutes);
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
