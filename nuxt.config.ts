// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
    'nuxt-directus',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-vuefire',
    '@pinia/nuxt',
    'nuxt-icon',
    '@nuxtjs/google-fonts',
  ],
  directus: {
    url: 'http://localhost:8055/items',
    autoFetch: true,
    devtools: true,
  },
  css: ['~/assets/css/animation.css'],
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
    },
  },
  tailwindcss: {
    exposeConfig: true,
    config: require('./tailwind.config.js'),
  },
  colorMode: {
    preference: 'system', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
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
      serviceAccount: './admin.json',
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
