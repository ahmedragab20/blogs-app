// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/devtools', 'nuxt-directus', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  // Defaults options
  directus: {
    url: 'http://localhost:8055/items',
    autoFetch: true,
    devtools: true,
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
    },
  },
  tailwindcss: {
    // add '~tailwind.config` alias
    exposeConfig: true,
  },
  colorMode: {
    preference: 'system', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
});
