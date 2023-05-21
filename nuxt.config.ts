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

    appCheck: {
      debug: process.env.NODE_ENV !== 'production',
      isTokenAutoRefreshEnabled: true,
      provider: 'ReCaptchaV3',
      key: 'AIzaSyDYZwMiELbHI7Z_rDQC-SsXWEAv5KCGuTA',
    },

    config: {
      apiKey: 'AIzaSyDYZwMiELbHI7Z_rDQC-SsXWEAv5KCGuTA',
      authDomain: 'auth-79e70.firebaseapp.com',
      projectId: 'auth-79e70',
      storageBucket: 'auth-79e70.appspot.com',
      messagingSenderId: '1067954839109',
      appId: '1:1067954839109:web:f3319baa7bf3ad538a0d2c',
      measurementId: 'G-6CNT03649G',
    },
  },
});
