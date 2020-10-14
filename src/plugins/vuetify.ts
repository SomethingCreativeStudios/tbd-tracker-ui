import '@fortawesome/fontawesome-free/css/all.css'; // Ensure you are using css-loader
import Vue from 'vue';
//@ts-ignore
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
   icons: {
      iconfont: 'fa',
      values: {
         clear: 'fas fa-trash',
         menu: 'fa fa-bars',
      },
   },
   theme: {
      options: { customProperties: true },
      themes: {
         light: {
            primary: colors.green.darken4,
            secondary: colors.shades.white,
            accent: colors.green.accent4,
            error: colors.red.darken4,
         },
      },
   },
});
