const routes = [
  {
    path: "/",
    component: () => import("layouts/LinksLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/WelcomePage.vue"),
      },
      {
        path: "login",
        component: () => import("pages/LoginUser.vue"),
      },
      {
        path: "loginmagic",
        component: () => import("pages/LoginMagic.vue"),
      },
      {
        path: "loginanon",
        component: () => import("pages/LoginAnon.vue"),
      },

      {
        path: "signup",
        component: () => import("pages/SignUpUser.vue"),
      },
      {
        path: "confirmation",
        component: () => import("pages/ConfirmacionMagicLogin.vue"),
      },
    ],
  },
  {
    path: "/dashboard",
    component: () => import("layouts/LinksLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "one",
        component: () => import("pages/DashboardOne.vue"),
      },
      {
        path: "two",
        component: () => import("pages/DashboardTwo.vue"),
      },
      {
        path: "three",
        component: () => import("pages/DashboardThree.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
