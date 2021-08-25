<template>
   <v-dialog v-model="dialog" persistent max-width="60%" scrollable :fullscreen="$vuetify.breakpoint.mobile" :transition="dialogTransition">
      <template #activator="{ on, attrs }">
         <slot name="activator" v-bind:attrs="attrs" v-bind:on="on">
            <v-btn v-bind="attrs" v-on="on">
               Open Dialog
            </v-btn>
         </slot>
      </template>
      <v-card>
         <v-card-title>
            <span class="headline">Anime</span>
         </v-card-title>
         <v-card-text>
            <v-container>
               <div class="sync-badge">
                  <v-icon small color="#E5A00D" @click="onSync">fas fa-sync {{ isSyncing ? 'fa-spin' : '' }}</v-icon>
               </div>
               <v-row>
                  <v-col cols="12" sm="4" md="2">
                     <v-select label="Watch Status" :items="watchingStatus" :value="show.watchStatus" @change="onChange('watchStatus', $event)" item-text="text" item-value="value"></v-select>
                  </v-col>
                  <v-col cols="12" sm="4" md="2">
                     <v-text-field label="Overall Score" :value="show.score" @change="onChange('score', Number($event))" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8" md="6">
                     <v-text-field label="Show Name" :value="show.name" @change="onChange('name', $event)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="2" md="1">
                     <v-text-field label="Total Downloaded" :value="show.downloaded" @change="onChange('downloaded', $event)" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="2" md="1">
                     <v-text-field label="Total Episodes" :value="show.numberOfEpisodes" @change="onChange('numberOfEpisodes', $event)" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                     <v-combobox :value="updatedShow.otherNames" label="Show Alt Names" multiple chips @change="onChange('otherNames', $event)">
                        <template v-slot:selection="{ item }">
                           <v-chip lighten-3 label small close @click:close="removeChip('otherNames', item)">
                              {{ item }}
                           </v-chip>
                        </template>
                     </v-combobox>
                  </v-col>
                  <v-col cols="12" sm="3" md="3">
                     <v-text-field label="Studio" :value="show.studio" @change="onChange('studio', $event)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3" md="3">
                     <v-menu v-model="datePickerMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                        <template v-slot:activator="{ on, attrs }">
                           <v-text-field v-model="updatedShow.airingData" label="Airing Date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="updatedShow.airingData" @input="datePickerMenu = false" @change="onChange('airingData', $event)"></v-date-picker>
                     </v-menu>
                  </v-col>
                  <v-col cols="12">
                     <v-textarea label="Description*" :value="show.description" @change="onChange('description', $event)"></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="6">
                     <v-combobox :value="updatedShow.tags" label="Show Tags" multiple chips @change="onChange('tags', $event)">
                        <template v-slot:selection="{ item }">
                           <v-chip lighten-3 label small close @click:close="removeChip('tags', item)">
                              {{ item }}
                           </v-chip>
                        </template>
                     </v-combobox>
                  </v-col>
                  <v-col cols="12" sm="6">
                     <v-combobox :value="updatedShow.genres" label="Show Genres" multiple chips @change="onChange('genres', $event)">
                        <template v-slot:selection="{ item }">
                           <v-chip lighten-3 label small close @click:close="removeChip('genres', item)">
                              {{ item }}
                           </v-chip>
                        </template>
                     </v-combobox>
                  </v-col>
                  <v-col cols="12" sm="6">
                     <v-row>
                        <v-select
                           class="folder-select"
                           label="Folder Path"
                           :value="show.folderPath"
                           :items="folderNames"
                           item-text="text"
                           item-value="value"
                           @change="onChange('folderPath', $event)"
                        ></v-select>
                        <v-icon class="folder-add" @click="makeFolder"> fas fa-plus</v-icon>
                     </v-row>
                  </v-col>
                  <v-col cols="12" sm="6">
                     <v-text-field label="Image Url" :value="show.imageUrl" @change="onChange('imageUrl', $event)"></v-text-field>
                  </v-col>
               </v-row>
            </v-container>
         </v-card-text>
         <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="onConfirm">
               <slot name="confirm">
                  Confirm
               </slot>
            </v-btn>
            <v-btn color="red darken-1" text @click="onCancel">
               <slot name="cancel">
                  Cancel
               </slot>
            </v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script>
import { clone } from 'ramda';
import { findBestMatch } from 'string-similarity';

import { WatchingStatus } from '@/models/anime';
import { AnimeModule } from '~modules/anime';

export default {
   name: 'anime-dialog',
   props: {
      id: {
         type: Number,
         default: 0,
      },
   },
   data() {
      return {
         dialog: false,
         updatedShow: {},
         datePickerMenu: false,
         newFoldersName: [],
         isSyncing: false,
      };
   },
   computed: {
      show() {
         return AnimeModule.show(this.id);
      },
      folderNames() {
         const folderNames = AnimeModule.folderNames.concat(this.newFoldersName);
         if (folderNames.length === 0) {
            return [];
         }
         return findBestMatch(this.show.name, folderNames)
            .ratings.sort((a, b) => {
               if (a.rating > b.rating) {
                  return -1;
               } else {
                  return 1;
               }
            })
            .map(rate => ({ text: rate.target, value: rate.target }));
      },
      watchingStatus() {
         return [
            { text: 'Watching', value: WatchingStatus.WATCHING },
            { text: 'Watched', value: WatchingStatus.WATCHED },
            { text: 'Not Watching', value: WatchingStatus.NOT_WATCHING },
            { text: 'Three Episode Rule', value: WatchingStatus.THREE_RULE },
         ];
      },
      dialogTransition() {
         return this.$vuetify.breakpoint.mobile ? 'dialog-bottom-transition' : '';
      },
   },
   watch: {
      show: {
         handler() {
            this.updatedShow.tags = clone(this.show.tags);
            this.updatedShow.genres = clone(this.show.genres);
            this.updatedShow.otherNames = clone(this.show.otherNames);
            this.updatedShow.airingData = new Date(this.show.airingData);
         },
         immediate: true,
      },
   },
   methods: {
      onCancel() {
         this.dialog = false;
         this.$emit('update:dialog', false);
         this.$emit('cancel');
      },
      onConfirm() {
         AnimeModule.updateAnime({ id: this.show.id, ...this.updatedShow, airingData: new Date(this.updatedShow.airingData) });

         this.dialog = false;
         this.$emit('update:dialog', false);
         this.$emit('confirm');
      },
      onSync() {
         console.log('SYNC!');
      },
      onChange(field, value) {
         this.updatedShow[field] = value;
      },
      removeChip(field, itemToRemove) {
         this.updatedShow[field].splice(this.updatedShow[field].indexOf(itemToRemove), 1);
         this.updatedShow[field] = [...this.updatedShow[field]];
      },
      async makeFolder() {
         const newFolder = await createNewFolder(this.id);
         this.newFoldersName.push(newFolder);
      },
   },
};
</script>

<style lang="scss" scoped>
.v-input ::v-deep {
   input.v-input.input-186 {
      max-height: 62px;
      line-height: 26px;
   }
}

.folder-add {
   padding-left: 10px;
   padding-right: 10px;
}

.folder-select {
   padding-left: 10px;
   flex: 1;
}

.sync-badge {
   position: absolute;
   top: 12px;
   right: 19px;

   z-index: 6;

   .v-icon {
      text-shadow: 1px 2px rgb(8 8 8 / 75%);
   }
}
</style>
