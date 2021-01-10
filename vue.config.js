const path = require('path');

module.exports = {
   lintOnSave: false,
   transpileDependencies: ['vuetify'],
   configureWebpack: {
      devServer: {
         clientLogLevel: 'info',
         watchOptions: {
            poll: true,
         },
      },
      resolve: {
         alias: {
            '~': path.resolve(__dirname, 'src/'),
            '~modules': path.resolve(__dirname, 'src/store/modules/'),
            '~dialogs': path.resolve(__dirname, 'src/components/dialogs/'),
         },
      },
   },
};
