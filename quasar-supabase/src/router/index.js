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
//import { existAccessToken } from "boot/supabase";
import { supabase } from "boot/supabase.js";
//import { useRouter } from "vue-router";

//const router = useRouter();
//const generalStore = useGeneralStore();

const defaultUser = import.meta.env.VITE_DEFAULT_USER;
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

// async function checkUser() {
//   try {
//     const {
//       data: {
//         session: { user },
//       },
//     } = await supabase.auth.getSession();
//     debugger;
//     if (user?.email && generalStore.user === user?.email)
//       generalStore.user = user?.email;
//     console.log("Email usuario actualizado.");
//   } catch (error) {
//     console.log("Error al actualizar user:", error);
//   }
// }

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

    //en caso de que se haya borrado el token del localStore
    //poner el usuario por defecto (Anonimo)
    // if (!existAccessToken() && generalStore.user !== defaultUser) {
    //   console.log("no existe AccessToken");
    //   generalStore.user = defaultUser;
    // }

    //checkUser();

    //console.log("to", to);

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
