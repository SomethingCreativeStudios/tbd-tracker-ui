const path = require('path');

module.exports = {
   lintOnSave: false,
   transpileDependencies: ['vuetify'],
   configureWebpack: {
      resolve: {
         alias: {
            '~': path.resolve(__dirname, 'src/'),
            '~modules': path.resolve(__dirname, 'src/store/modules/'),
            '~dialogs': path.resolve(__dirname, 'src/components/dialogs/'),
         },
      },
   },
};
