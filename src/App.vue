<template>
   <v-app id="app">
      <v-navigation-drawer v-model="drawer" app absolute bottom temporary>
         <v-list nav dense>
            <v-list-item-group>
               <v-list-item :to="'/'">
                  <v-list-item-icon>
                     <v-icon>fas fa-list</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Anime List</v-list-item-title>
               </v-list-item>

               <v-list-item :to="'downloads'">
                  <v-list-item-icon>
                     <v-icon>fas fa-download</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Current Downloads</v-list-item-title>
               </v-list-item>

               <v-list-item :to="'settings'">
                  <v-list-item-icon>
                     <v-icon>fas fa-wrench</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Settings</v-list-item-title>
               </v-list-item>
            </v-list-item-group>
         </v-list>
      </v-navigation-drawer>

      <v-app-bar app dark color="primary">
         <v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>

         <v-toolbar-title class="title">TBA Tracker</v-toolbar-title>
      </v-app-bar>

      <v-main>
         <router-view></router-view>
      </v-main>
   </v-app>
</template>

<script>
export default {
   name: 'App',

   components: {},

   data: () => ({ drawer: false }),

   mounted() {},
};
</script>

<style lang="scss" scoped></style>
