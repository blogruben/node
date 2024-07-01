<template>
  <q-page class="flex flex-center column">
    <h3>Welcome</h3>
    <q-btn label="Check session" color="primary" @click="check" />
  </q-page>
</template>

<script setup>
import { supabase } from "boot/supabase.js";
async function check() {
  console.log(supabase.auth);
  const data = await supabase.auth.getSession();
  console.log("Email " + data?.data?.session?.user?.email);
}
</script>
