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
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();
const generalStore = useGeneralStore();
const { user } = storeToRefs(generalStore);
const inputEmail = ref("info@blogruben.com");
const password = ref(null);

async function onSubmit() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: inputEmail.value,
    password: password.value,
  });
  password.value = null;
  if (error) {
    alert(error);
  } else {
    user.value = inputEmail.value;
    inputEmail.value = null;
    router.push({ path: "/dashboard/one" });
  }
}
</script>
