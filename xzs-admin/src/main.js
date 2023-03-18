import Vue from "vue";
import App from "./App.vue";
import { router } from "./router";
import store from "./store";
import "normalize.css/normalize.css";
import Element from "element-ui";
import "./styles/element-variables.scss";
import cookie from "js-cookie";
import "@/styles/index.scss"; // global css
import "./icons"; // icon
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import * as echarts from 'echarts';

	//引入 导出Excel vue-json-excel
Vue.use(Element, {
  size: "medium", // set element-ui default size
});


Vue.prototype.$echarts = echarts

Vue.config.productionTip = false;

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"];

router.beforeEach((to, from, next) => {
  // start progress bar
  NProgress.start();
/*   if (to.meta.title !== undefined) {
    document.title = to.meta.title;
  } else {
    document.title = "\u200E";
  }
  // store.commit("router/initRoutes");

  if (to.path) {
    // eslint-disable-next-line no-undef
    _hmt.push(["_trackPageview", "/#" + to.fullPath]);
  } */

  // next()



  // 获取用户token，用来判断当前用户是否登录
  const hasToken = cookie.get("Authorization");
  if (hasToken) {
    document.title = to.meta.title;
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      let user = cookie.get("adminUserInfo")
      if (user !== undefined) {
        store.dispatch("user/initUserInfo").then((userInfo) => {
          store.dispatch("router/addAsyncRoutes").then((accessRoutes) => {
            try {
              // 动态添加格式化过的路由
              router.addRoutes(accessRoutes)
              /* accessRoutes.forEach((item) => {
                router.options.routes.push(item);
                router.addRoute(item);
              }); */
              // constantRoutes.concat(accessRoutes);
              next({ ...to, replace: true });
            } catch (error) {
              Message.error('出错了')
              next(`/login?redirect=${to.path}`);
              NProgress.done();
            }
          });
        });
        next();
      } else {
        store.dispatch("user/initUserInfo").then((userInfo) => {
          store.dispatch("router/addAsyncRoutes").then((accessRoutes) => {
            try {
              // 动态添加格式化过的路由
              router.addRoutes(accessRoutes)
              /* accessRoutes.forEach((item) => {
                router.options.routes.push(item);
                router.addRoute(item);
              }); */
              // constantRoutes.concat(accessRoutes);
              next({ ...to, replace: true });
            } catch (error) {
              // Message.error('出错了')
              next(`/login?redirect=${to.path}`);
              NProgress.done();
            }
          });
        });
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

Vue.prototype.$$router = router;

new Vue({
  router: router,
  store: store,
  render: (h) => h(App),
}).$mount("#app");
