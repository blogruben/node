import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
//import { storeToRefs } from "pinia";
import { useGeneralStore } from "stores/general";
import { existAccessToken } from "boot/supabase";

const defaultUser = import.meta.env.VITE_DEFAULT_USER;
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const generalStore = useGeneralStore();

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeResolve((to, from, next) => {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    console.log("beforeResolve");
    console.log("existAccessToken", existAccessToken());
    console.log("eneralStore.user", generalStore.user);
    if (!existAccessToken() && generalStore.user !== defaultUser) {
      console.log("no existe AccessToken");
      generalStore.user = defaultUser;
    }
    //console.log("beforeResolve");
    next();
  });

  Router.beforeEach((to, from, next) => {
    if (
      to.matched.some((record) => record.meta.requiresAuth) &&
      generalStore.user === defaultUser
    ) {
      next({ path: "/", query: { nextPage: to.fullPath } });
    } else {
      next();
    }
  });

  return Router;
});
