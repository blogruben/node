<template>
  <q-page class="flex flex-center column">
    <h1>Dashboard One</h1>
    <q-btn label="notas" @click="verNotas" color="primary" />
    <p v-for="note in notes" :key="note.id">
      {{ note.note }}
    </p>
  </q-page>
</template>

<script setup>
import { supabase } from "boot/supabase.js";
import { ref } from "vue";

const notes = ref([]);

async function verNotas() {
  try {
    let { data: simple_notes, error } = await supabase
      .from("simple_notes")
      .select("*");
    if (error) throw error;
    notes.value = simple_notes;
    console.log(simple_notes);
  } catch (error) {
    alert(error);
  }
}
</script>
