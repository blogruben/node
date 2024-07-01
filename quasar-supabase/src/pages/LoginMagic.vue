<template>
  <q-page class="flex flex-center">
    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <h6>Loguearse o darse de alta con Magic Link</h6>
      <q-input filled v-model="inputEmail" type="email" hint="Email" />

      <div>
        <q-btn label="Enviar" type="submit" color="primary" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "boot/supabase.js";
import { useRouter } from "vue-router";

//const router = useRouter();
const inputEmail = ref("info@blogruben.com");

async function onSubmit() {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: inputEmail.value,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: "http://localhost:9000/#/confirmation",
      },
    });
    if (error) throw error;
    console.log("Correo con magic link enviado");
  } catch (error) {
    alert("Error al enviar el correo con magic link", error);
  }
}
</script>
