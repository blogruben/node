<template>
  <q-page class="flex flex-center">
    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <h6>Loguearse con password</h6>
      <q-input filled v-model="inputEmail" type="email" hint="Email" />
      <q-input filled v-model="password" type="password" label="password" />
      <div>
        <q-btn label="Entrar" type="submit" color="primary" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "boot/supabase.js";
import { useGeneralStore } from "stores/general";
import { useRouter } from "vue-router";

const generalStore = useGeneralStore();

const router = useRouter();
const inputEmail = ref("info@blogruben.com");
const password = ref(null);

async function onSubmit() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: inputEmail.value,
      password: password.value,
    });
    password.value = null;
    if (error) throw error;
    console.log("Logueado con contrasena.");
    router.push({ path: "/dashboard/one" });
    //generalStore.checkUserEmail();
  } catch (error) {
    alert("Error al eloguearse con password", error);
  }
}
</script>
