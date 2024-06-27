<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="bg-primary text-white"
      height-hint="98"
      @click="checkUserEmail"
    >
      <q-tabs>
        <q-route-tab to="/" label="Welcome" />
        <q-route-tab to="/signup" label="Sign up" />
        <q-route-tab to="/login" label="Login Pass" />
        <q-route-tab to="/loginmagic" label="Login Magic" />
        <q-route-tab label="Reset password" />
        User: {{ user }}
      </q-tabs>
      <q-tabs>
        <q-route-tab to="/dashboard/one" label="Dashboard 1" />
        <q-route-tab to="/dashboard/two" label="Dashboard 2" />
        <q-route-tab to="/dashboard/three" label="Dashboard 3" />
        <q-route-tab label="Logout" @click="logout" />
        <q-route-tab label="check" @click="check" />
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
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log("Session de usuario cerrada");
    router.push({ path: "/" });
  } catch (error) {
    alert("Error en signOut: ", error.message);
  }
}

async function check() {
  console.log(supabase.auth);
}

async function checkUserEmail() {
  try {
    const authSession = await supabase.auth.getSession();
    const userMail = authSession.data?.session?.user?.email;
    const userDefault = import.meta.env.VITE_DEFAULT_USER;
    if (userMail && generalStore.user !== userMail) {
      generalStore.user = userMail;
      console.log("Email usuario actualizado al email de la session.");
    } else if (!userMail && generalStore.user !== userDefault) {
      generalStore.user = userDefault;
      console.log("Email usuario actualizado a valor por defecto.");
    }
  } catch (error) {
    console.log("Error al actualizar user:", error);
  }
}
</script>
