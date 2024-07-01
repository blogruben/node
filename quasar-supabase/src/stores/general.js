import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "boot/supabase.js";

export const useGeneralStore = defineStore("general", () => {
  const user = ref(import.meta.env.VITE_DEFAULT_USER);

  async function checkUserEmail() {
    try {
      const authSession = await supabase.auth.getSession();
      const userMail = authSession.data?.session?.user?.email;
      const userDefault = import.meta.env.VITE_DEFAULT_USER;
      if (userMail && user.value !== userMail) {
        user.value = userMail;
        console.log("Email usuario actualizado al email de la session.");
      } else if (!userMail && user.value !== userDefault) {
        user.value = userDefault;
        console.log("Email usuario actualizado a valor por defecto.");
      }
    } catch (error) {
      console.log("Error al actualizar user:", error);
    }
  }

  return { user, checkUserEmail };
});
