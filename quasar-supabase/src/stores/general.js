import { defineStore } from "pinia";
import { ref } from "vue";

export const useGeneralStore = defineStore("general", () => {
  const user = ref(import.meta.env.VITE_DEFAULT_USER);

  return { user };
});
