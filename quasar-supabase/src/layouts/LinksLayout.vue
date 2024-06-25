<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-tabs>
        <q-route-tab to="/" label="Welcome" />
        <q-route-tab to="/signup" label="Sign up" />
        <q-route-tab to="/login" label="Login Pass" />
        <q-route-tab to="/loginmagic" label="Login Magic" />
        User: {{ user }}
      </q-tabs>
      <q-tabs>
        <q-route-tab to="/dashboard/one" label="Dashboard 1" />
        <q-route-tab to="/dashboard/two" label="Dashboard 2" />
        <q-route-tab to="/dashboard/three" label="Dashboard 3" />
        <q-route-tab label="Logout" @click="logout" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useGeneralStore } from "stores/general";
import { storeToRefs } from "pinia";
import { supabase } from "boot/supabase.js";
import { useRouter } from "vue-router";

const router = useRouter();
const generalStore = useGeneralStore();
const { user } = storeToRefs(generalStore);

async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert(error);
  } else {
    user.value = import.meta.env.VITE_DEFAULT_USER;
    router.push({ path: "/" });
  }
}
</script>
