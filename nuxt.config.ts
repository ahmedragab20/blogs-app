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
      baseURL: process.env.BASE_URL,
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
      serviceAccount: import.meta.env.ADMIN_URL,
    },

    // appCheck: { //TODO:: Enable this later
    //   debug: false,
    //   isTokenAutoRefreshEnabled: true,
    //   provider: 'ReCaptchaEnterprise',
    //   key: config.FIREBASE_API_KEY,
    // },

    config: {
      apiKey: config.FIREBASE_API_KEY,
      authDomain: config.FIREBASE_AUTH_DOMAIN,
      projectId: config.FIREBASE_PROJECT_ID,
      storageBucket: config.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
      appId: config.FIREBASE_APP_ID,
      measurementId: config.FIREBASE_MEASUREMENT_ID,
    },
  },

  pinia: {
    autoImports: ['defineStore', ['defineStore', 'definePiniaStore']],
  },

  // devtools: true
});
