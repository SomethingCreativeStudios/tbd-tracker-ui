<template>
   <v-dialog
      :class="`mobile-${$vuetify.breakpoint.mobile}`"
      v-model="dialog"
      persistent
      max-width="60%"
      scrollable
      :fullscreen="$vuetify.breakpoint.mobile"
      :transition="dialogTransition"
   >
      <template #activator="{ on, attrs }">
         <slot name="activator" v-bind:attrs="attrs" v-bind:on="on">
            <v-btn v-bind="attrs" v-on="on">
               Open Dialog
            </v-btn>
         </slot>
      </template>

      <v-card>
         <v-tabs v-model="tab">
            <v-tab>Search Anime</v-tab>
            <v-tab>Find By Season</v-tab>
         </v-tabs>
         <v-tabs-items v-model="tab">
            <v-tab-item>
               <v-row class="search-body">
                  <v-col cols="12">
                     <v-text-field label="Anime Name" :loading="searchingAnime" @change="onSearch"> </v-text-field>
                  </v-col>
                  <div class="results">
                     <template v-for="(result, index) in results">
                        <search-result
                           :key="result.title"
                           v-bind="result"
                           :selected="index === selectedIndex"
                           @click="onClick(index, $event)"
                        ></search-result>
                     </template>
                  </div>
               </v-row>
            </v-tab-item>
            <v-tab-item>
               <v-row class="season-body">
                  <v-col cols="12" md="6">
                     <v-select label="Season" :items="seasons" item-value="value" item-text="label" v-model="selectedSeason"></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                     <v-select label="Year" :items="years" v-model="selectedYear"></v-select>
                  </v-col>
               </v-row>
            </v-tab-item>
         </v-tabs-items>
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
import { mapState } from 'vuex';
import { clone } from 'ramda';

import { WatchingStatus } from '@/models/anime';
import { AnimeModule } from '~modules/anime';
import { createFromSeason } from '~/compositions/series/series';
import { setSetting } from '~/compositions/settings';
import axios from '~/axios/axios';
import { SearchResult } from './components';
import { SeasonName } from '@/models/season';
import { SettingsModule } from '@/store/modules/settings';

export default {
   name: 'anime-search-dialog',
   components: { SearchResult },
   props: {
      id: {
         type: Number,
         default: 0,
      },
   },
   data() {
      return {
         tab: null,
         dialog: false,
         searchingAnime: false,
         results: [],
         selectedIndex: -1,
         seasons: [
            { label: 'Winter', value: SeasonName.WINTER },
            { label: 'Spring', value: SeasonName.SPRING },
            { label: 'Summer', value: SeasonName.SUMMER },
            { label: 'Fall', value: SeasonName.FALL },
         ],
         years: ['2020', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
         selectedSeason: SeasonName.WINTER,
         selectedYear: '2020',
      };
   },
   computed: {
      dialogTransition() {
         return this.$vuetify.breakpoint.mobile ? 'dialog-bottom-transition' : '';
      },
   },
   watch: {},
   methods: {
      onCancel() {
         this.dialog = false;
         this.$emit('update:dialog', false);
         this.$emit('cancel');
      },
      async onConfirm() {
         const results = this.tab === 0 ? this.results[this.selectedIndex] : await createFromSeason(this.selectedYear, this.selectedSeason);

         if (this.tab !== 0) {
            const newYear = await setSetting('currentYear', this.selectedYear);
            const newSeason = await setSetting('currentSeason', this.selectedSeason);

            SettingsModule.setCurrentYear(newYear.value);
            SettingsModule.setCurrentSeason(newSeason.value);
         }

         this.dialog = false;
         this.$emit('update:dialog', false);
         this.$emit('confirm', { type: this.tab === 0 ? 'mal' : 'season', results });
      },
      onClick(index, selected) {
         this.selectedIndex = selected ? index : -1;
      },
      async onSearch(text) {
         this.searchingAnime = true;
         this.selectedIndex = -1;

         const results = await axios.get(`/series/mal/${text}`);
         this.$set(this, 'results', results.data);

         this.searchingAnime = false;
      },
   },
};
</script>

<style lang="scss" scoped>
.v-card,
.v-dialog {
   overflow: hidden;
}

.v-input ::v-deep {
   input.v-input.input-186 {
      max-height: 62px;
      line-height: 26px;
   }
}

.results {
   height: 610px;
   padding: 21px;

   overflow-y: scroll;
}

.season-body,
.search-body {
   padding: 20px;
}

.v-dialog--fullscreen {
}
</style>
