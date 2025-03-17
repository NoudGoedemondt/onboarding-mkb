import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { ptiLightTheme } from './theme';
import { auth } from './firebase';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'ptiLightTheme',
    themes: {
      ptiLightTheme,
    },
  },
});

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App).use(router).use(vuetify).mount('#app');
  }
});
