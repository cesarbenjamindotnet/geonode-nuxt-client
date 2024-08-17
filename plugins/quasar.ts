import { Quasar } from 'quasar';
import '@quasar/extras/mdi-v5/mdi-v5.css'; // MDI v5
import '@quasar/extras/material-icons/material-icons.css'; // Material Icons

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Quasar, {
    iconSet: 'material-icons', // Define el set predeterminado (Material Icons)
    config: {
      brand: {}, // Aquí puedes configurar los colores y otros ajustes globales
    },
  });
});
