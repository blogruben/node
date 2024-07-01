<template>
  <q-page class="flex flex-center column">
    <h3>Welcome</h3>
    <q-btn label="Check session" color="primary" @click="check" />

    <p>Falta loguin anonimo</p>
    <p>un listado de prueba</p>
    <p>borrar el env de github</p>
  </q-page>
</template>

<script setup>
import { supabase } from "boot/supabase.js";
async function check() {
  console.log(supabase.auth);
  const data = await supabase.auth.getSession();
  console.log("Email " + data?.data?.session?.user?.email);

  //const { error } = await supabase.auth.verifyOtp({ token_hash, type })
}
</script>
