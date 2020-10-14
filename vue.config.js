module.exports = {
   lintOnSave: false,
   transpileDependencies: ['vuetify'],
   chainWebpack: config => {
      config.resolve.alias.set('~', path.resolve(__dirname, '/src'));
   },
};
