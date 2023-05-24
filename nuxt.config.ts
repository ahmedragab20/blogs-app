import config from './config';
export default defineNuxtConfig({
  css: ['~/assets/css/main.css', '~/assets/css/animation.css'],

  modules: [
    '@nuxt/devtools',
    'nuxt-directus',
    'nuxt-vuefire',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxthq/ui',
  ],

  directus: {
    url: 'http://localhost:8055/items',
    autoFetch: true,
    devtools: true,
  },

  runtimeConfig: {
    public: {
      baseURL: process.env.VITE_BASE_URL,
    },
  },

  googleFonts: {
    families: {
      'Headland One': true,
      Poppins: true,
    },
  },

  vuefire: {
    auth: true,
    admin: {
      serviceAccount: import.meta.env.VITE_ADMIN_URL,
    },

    // appCheck: {
    //   debug: false,
    //   isTokenAutoRefreshEnabled: true,
    //   provider: 'ReCaptchaV3',
    //   key: import.meta.env.VITE_FIREBASE_API_KEY,
    // },

    config: {
      apiKey: config.VITE_FIREBASE_API_KEY,
      authDomain: config.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: config.VITE_FIREBASE_PROJECT_ID,
      storageBucket: config.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: config.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: config.VITE_FIREBASE_APP_ID,
      measurementId: config.VITE_FIREBASE_MEASUREMENT_ID,
    },
  },

  pinia: {
    autoImports: ['defineStore', ['defineStore', 'definePiniaStore']],
  },

  // devtools: true
});
