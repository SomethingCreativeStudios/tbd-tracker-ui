<template>
   <v-app id="app" :style="appStyles" :class="`mobile-${$vuetify.breakpoint.mobile}`">
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

         <template v-if="view === 'anime'">
            <v-spacer></v-spacer>
            <v-layout v-if="selectedShows.length" class="action-buttons">
               <v-btn text>
                  <span><v-icon class="action-icon">fas fa-check</v-icon> {{ selectedShows.length }} {{ !isMobile ? 'Selected' : '' }}</span>
               </v-btn>
               <v-btn @click="selectAll" text
                  ><span> <v-icon class="action-icon">fas fa-check-double</v-icon>{{ !isMobile ? 'Select All' : '' }} </span>
               </v-btn>
               <v-btn @click="unselectAll" text
                  ><span><v-icon class="action-icon">fas fa-times</v-icon> {{ !isMobile ? 'Deselect All' : '' }}</span>
               </v-btn>
               <v-btn @click="deleteAll" text
                  ><span><v-icon class="action-icon">fas fa-trash</v-icon>{{ !isMobile ? 'Delete Selected' : '' }}</span>
               </v-btn>

               <confirm-dialog v-if="!isMobile" :maxWidth="360" @confirm="onCopySelected">
                  <template #headline>
                     Copy Subgroups from
                  </template>
                  <template #message>
                     <v-select :items="showNames" label="Show Names" v-model="showToCopy"></v-select>
                  </template>
                  <template #activator="{ on, attrs }">
                     <v-btn v-on="on" v-bind="attrs" text>
                        <span><v-icon class="action-icon">fas fa-copy</v-icon> Copy Subgroups From</span>
                     </v-btn>
                  </template>
               </confirm-dialog>
            </v-layout>
            <v-spacer></v-spacer>
            <v-icon @click="syncShows">fas fa-sync</v-icon>
            <v-icon style="padding-left: 10px" @click="checkSubgroups">fas fa-exclamation</v-icon>
         </template>
         <template v-if="view === 'downloads'">
            <v-spacer></v-spacer>
         </template>
      </v-app-bar>

      <v-main class="main-nav">
         <router-view></router-view>
      </v-main>
      <v-snackbar v-model="showMessage" :timeout="5000">
         {{ message }}
         <template v-slot:action="{ attrs }">
            <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
               Close
            </v-btn>
         </template>
      </v-snackbar>
   </v-app>
</template>

<script>
import { mapState } from 'vuex';
import { AnimeModule } from '~/store/modules/anime';
import { ConfirmDialog } from '~/components/dialogs';
import { AppModule } from './store/modules/app';
import { MessageModule } from '~modules/message';

export default {
   name: 'App',

   components: { ConfirmDialog },

   data: () => {
      return {
         snackbar: false,
         drawer: false,
         height: 0,
         showToCopy: -1,
      };
   },

   computed: {
      ...mapState({
         view: ({ app }) => app.view,
         selectedShows: ({ anime }) => anime.selectedShows || [],
      }),
      appStyles() {
         return {
            '--app-height': `${this.height}px`,
         };
      },
      isMobile() {
         return this.$vuetify.breakpoint.mobile;
      },
      showNames() {
         return AnimeModule.shows.map(({ name, id }) => ({ text: name, value: id }));
      },
      showMessage: {
         get: function() {
            return MessageModule.showMessage;
         },
         set: function(value) {
            MessageModule.setShowMessage(value);
         },
      },
      message() {
         return MessageModule.message;
      },
   },
   watch: {
      $route: {
         handler(to, from) {
            AppModule.setView(this.$router.currentRoute.name);
            console.log(to, from);
         },
      },
   },
   mounted() {
      this.height = window.innerHeight;
      AppModule.setView(this.$router.currentRoute.name);
      console.log(this.$router.currentRoute.path);
      document.addEventListener('resize', () => {
         this.height = window.innerHeight;
      });
      console.log('I have updated! 2');
   },
   methods: {
      syncShows() {
         // syncShows();
      },

      testDownload() {
         // downloadShowTest();
      },

      addDownload() {},

      selectAll() {
         AnimeModule.selectAll();
         AnimeModule.setSelectMode('multi');
      },
      unselectAll() {
         AnimeModule.setSelected([]);
         AnimeModule.setSelectMode('single');
      },

      async deleteAll() {
         await AnimeModule.removeShowByIds(this.selectedShows);
         await AnimeModule.setSelected([]);
         await AnimeModule.setSelectMode('single');
      },

      async onCopySelected() {
         // await copySubgroup(this.showToCopy, this.selectedShows);
         location.reload();
      },

      async waitFor(time) {
         return new Promise(resolve => {
            setTimeout(() => {
               resolve();
            }, time);
         });
      },

      async checkSubgroups() {
         for await (const show of AnimeModule.shows) {
            await AnimeModule.findSubgroups(show);
            await this.waitFor(300);
         }
      },
   },
};
</script>

<style lang="scss" scoped>
.v-app-bar {
   height: 55px !important;
}

.mobile-true {
   .action-buttons .v-btn {
      min-width: 32px;
   }
}

.action-icon {
   padding-right: 10px;
}

.main-nav {
   padding-top: 64px;
}
</style>
