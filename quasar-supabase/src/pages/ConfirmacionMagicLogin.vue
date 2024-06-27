<template>
  <q-page class="flex flex-center">
    <h5>Email confirmado, ya estas logueado</h5>
    <q-btn label="intentar" color="primary" @click="intentar" />
  </q-page>
</template>

<script setup>
import { supabase } from "boot/supabase.js";
//http://localhost:9000/#/emailconfirmacion#
//                        access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6IkZzV0pZbTdQcGtuUHJ0dzgiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE5NDMzNzY2LCJpYXQiOjE3MTk0MzAxNjYsImlzcyI6Imh0dHBzOi8vd2pzYmZvbWZxbXZ6c2R6and2YWMuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjA3YjgxNjljLTA1YWEtNDVhNi1hMTdkLTc3YmQ3NDNlNmJmOSIsImVtYWlsIjoiaW5mb0BibG9ncnViZW4uY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6ImluZm9AYmxvZ3J1YmVuLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiIwN2I4MTY5Yy0wNWFhLTQ1YTYtYTE3ZC03N2JkNzQzZTZiZjkifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvdHAiLCJ0aW1lc3RhbXAiOjE3MTk0MzAxNjZ9XSwic2Vzc2lvbl9pZCI6ImM5NmQ3OTRjLWNhYmEtNDZmNy1iNjg2LWMwNzFmYzBhZmNhMiIsImlzX2Fub255bW91cyI6ZmFsc2V9.490P1Dx6oJGfgflvS9_T-b3MIuBycKL6wFPRt-m4874
//                        &expires_at=1719433766
//                        &expires_in=3600
//                        &refresh_token=mGVLsapz0V2bzgoPgoLprg
//                        &token_type=bearer
//                        &type=magiclink

//import { useRouter } from "vue-router";
//const router = useRouter();

const urlending = window.location.hash;
const urlparams =
  '{"' + urlending.substring(urlending.lastIndexOf("?") + 1) + '"}';
const params = urlparams.replace(/&/g, '","').replace(/=/g, '":"');
console.log("params", params);
const paramsobject = JSON.parse(params);
console.log("paramsobject", paramsobject);
console.log("paramsobject.token_hash", paramsobject.token_hash);
console.log("paramsobject.type", paramsobject.type);

// if (paramsobject) {
//   supabase.auth
//     .verifyOtp({
//       token_hash: paramsobject.access_token,
//       type: paramsobject.type,
//     })
//     .then((error) => {
//       if (error) throw error;
//       console.log("Verificacion correcta");
//     })
//     .catch((error) => alert("Error: " + error.error));
// }

async function intentar() {
  console.log(
    "token_hash",
    paramsobject.token_hash,
    typeof paramsobject.token_hash
  );
  console.log("type", paramsobject.type, typeof paramsobject.type);
  const { session, error } = await supabase.auth.verifyOtp({
    token_hash: paramsobject.token_hash,
    type: paramsobject.type,
  });
  console.log("session", session, typeof session);
  console.log("error", error, typeof error);
}
</script>
