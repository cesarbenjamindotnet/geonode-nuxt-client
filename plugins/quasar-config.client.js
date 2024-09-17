// plugins/quasar-config.client.js
export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const quasarBrand = runtimeConfig.public.quasarBrand
  
  // Define CSS variables globally
  const styleElement = document.createElement('style')
  styleElement.innerHTML = `
    :root {
      --primary: ${quasarBrand.primary};
      --secondary: ${quasarBrand.secondary};
      --accent: ${quasarBrand.accent};
      --dark: ${quasarBrand.dark};
      --dark-page: ${quasarBrand["dark-page"]};
      --positive: ${quasarBrand.positive};
      --negative: ${quasarBrand.negative};
      --info: ${quasarBrand.info};
      --warning: ${quasarBrand.warning};
    }
  `
  document.head.appendChild(styleElement)

  nuxtApp.provide('quasarBrand', quasarBrand)
})
