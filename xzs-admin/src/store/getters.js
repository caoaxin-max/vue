const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  userName: state => state.user.userName,
  routes: state => state.router.routes,
  // addAsyncRoutes: state => state.app.addAsyncRoutes
}
export default getters
