<template>
  <q-page class="flex flex-center">
    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <h6>Crear cuenta</h6>
      <q-input filled v-model="email" type="email" label="email" />
      <q-input filled v-model="password" type="password" label="password" />
      <div>
        <q-btn label="Crear cuenta" type="submit" color="primary" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "boot/supabase.js";

const email = ref("info@blogruben.com");
const password = ref(null);

async function onSubmit() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    debugger;
    password.value = null;

    if (error) throw error;
    //user.value = email.value;
  } catch (error) {
    alert(error);
  }
}
</script>
