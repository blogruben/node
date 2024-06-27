<template>
  <q-page class="flex flex-center">
    <h1>Welcome</h1>
    <q-btn label="Check session" color="primary" @click="check" />
  </q-page>
</template>

<script setup>
import { supabase } from "boot/supabase.js";
async function check() {
  console.log(supabase.auth);
  const {
    data: {
      session: { user },
    },
  } = await supabase.auth.getSession();
  console.log(user.email);

  //const { error } = await supabase.auth.verifyOtp({ token_hash, type })
}
</script>
