// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'GeoNode Nuxt Client',
      meta: [
        { name: 'description', content: 'Geonode WebApp Client Made with Nuxt3 and VueJS 3 (As replacement Geonode Mapstore Client)' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
      ]
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', "@nuxt/ui", "nuxt-quasar-ui"],
})