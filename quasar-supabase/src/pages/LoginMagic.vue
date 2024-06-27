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
import { useGeneralStore } from "stores/general";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();
//const generalStore = useGeneralStore();
//const { user } = storeToRefs(generalStore);
const inputEmail = ref("info@blogruben.com");
//const password = ref(null);

async function onSubmit() {
  try {
    // const { data, error } = await supabase.auth.signIn({
    //   email: inputEmail.value,
    //   password: password.value,
    // });

    const { data, error } = await supabase.auth.signInWithOtp({
      email: inputEmail.value,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: "http://localhost:9000/#/confirmation",
      },
    });
    if (error) throw error;
    console.log("data", data);
  } catch (error) {
    alert(error.message);
  }
}
</script>
