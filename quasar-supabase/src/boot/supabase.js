import { boot } from "quasar/wrappers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_APP_SUPABASE_URL,
  import.meta.env.VITE_APP_SUPABASE_ANON_KEY
);

// function existAccessToken() {
//   let hasAccessToken = false;
//   Object.values(window.localStorage).forEach((value) => {
//     const object = JSON.parse(value);
//     if (object.hasOwnProperty("access_token")) {
//       hasAccessToken = true;
//     }
//   });
//   return hasAccessToken;
// }

export { supabase };

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
});
