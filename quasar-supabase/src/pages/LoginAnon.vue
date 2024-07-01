<template>
  <q-page class="flex flex-center">
    <q-form class="q-gutter-md">
      <h6>Loguearse de forma anonima</h6>
      <q-btn label="Login Anon" @click="loginanon" color="primary" />
      <h6>Link email</h6>
      <q-btn
        label="Link to email"
        @click="linkSessionToEmail"
        color="primary"
      />
      <q-input filled v-model="inputEmail" type="email" hint="Email" />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "boot/supabase.js";
import { useRouter } from "vue-router";

const inputEmail = ref("info@blogruben.com");
const router = useRouter();

async function loginanon() {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    console.log("Session anonima creada.");
    router.push({ path: "/dashboard/one" });
  } catch (error) {
    alert("Error " + error);
  }
}

async function linkSessionToEmail() {
  try {
    const { data, error } = await supabase.auth.updateUser({
      email: inputEmail.value,
    });
    if (error) throw error;
    console.log("La session actual se ha unido al email" + inputEmail.value);
    router.push({ path: "/dashboard/one" });
  } catch (error) {
    alert("Error " + error);
  }
}
</script>
