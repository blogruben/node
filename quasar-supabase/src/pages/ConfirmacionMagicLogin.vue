<script setup>
import { supabase } from "boot/supabase.js";
import { onMounted, watch } from "vue";
import { useGeneralStore } from "stores/general";

onMounted(() => {
  const paramsobject = leerParametrosUrl();
  crearSession(paramsobject).then(() => {
    checkUserEmail();
  });
});

function leerParametrosUrl() {
  const urlending = window.location.hash;
  const urlparams =
    '{"' + urlending.substring(urlending.lastIndexOf("?") + 1) + '"}';
  const params = urlparams.replace(/&/g, '","').replace(/=/g, '":"');
  const paramsobject = JSON.parse(params);
  console.log("paramsobject.token_hash", paramsobject.token_hash);
  console.log("paramsobject.type", paramsobject.type);
  return paramsobject;
}

async function checkUserEmail() {
  const generalStore = useGeneralStore();
  generalStore.checkUserEmail();
}

async function crearSession(paramsobject) {
  const { session, error } = await supabase.auth.verifyOtp({
    token_hash: paramsobject.token_hash,
    type: paramsobject.type,
  });
}
</script>

<template>
  <q-page class="flex flex-center">
    <h5>Email confirmado, ya estas logueado</h5>
  </q-page>
</template>
