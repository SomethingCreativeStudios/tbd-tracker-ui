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

      <v-card :class="loading ? 'loading' : ''">
         <div v-if="loading" class="progress-block">
            <v-progress-circular :size="100" indeterminate color="primary"></v-progress-circular>
         </div>

         <v-tabs v-model="tab">
            <v-tab>Search Anime</v-tab>
            <v-tab>Find By Season</v-tab>
         </v-tabs>
         <v-tabs-items v-model="tab">
            <v-tab-item>
               <v-row class="search-body">
                  <v-row>
                     <v-col cols="12" md="10">
                        <v-text-field label="Anime Name" :loading="searching" v-model="search"> </v-text-field>
                     </v-col>
                     <v-col cols="12" md="2">
                        <v-btn class="button" color="green darken-1" text @click="onMalSearch(search)">
                           Search
                        </v-btn>
                     </v-col>
                  </v-row>
                  <search-collection :results="malAnime" @selected="onSelected($event, 'mal')"></search-collection>
               </v-row>
            </v-tab-item>
            <v-tab-item>
               <v-row class="season-body">
                  <v-row>
                     <v-col cols="12" md="5">
                        <v-select label="Season" :items="seasons" item-value="value" item-text="label" v-model="selectedSeason"></v-select>
                     </v-col>
                     <v-col cols="12" md="5">
                        <v-select label="Year" :items="years" v-model="selectedYear"></v-select>
                     </v-col>
                     <v-col cols="12" md="2">
                        <v-btn class="button" color="green darken-1" text @click="onSeasonSearch">
                           Search
                        </v-btn>
                     </v-col>
                  </v-row>
                  <search-collection
                     :multiSelect="true"
                     :defaultSelected="true"
                     :results="seasonAnime"
                     @selected="onSelected($event, 'season')"
                  ></search-collection>
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
import { SeasonName } from '@/models/season';
import { SettingsModule } from '@/store/modules/settings';
import { service as SettingService } from '~/websockets/settingsService';
import { service as SeriesService } from '~/websockets/seriesService';
import SearchCollection from './components/search-collection/SearchCollection.vue';

export default {
   name: 'anime-search-dialog',
   components: { SearchCollection },
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
         loading: false,
         searching: false,
         search: '',
         malAnime: [],
         malSelected: [],
         seasonAnime: [],
         seasonSelected: [],
         seasons: [
            { label: 'Winter', value: SeasonName.WINTER },
            { label: 'Spring', value: SeasonName.SPRING },
            { label: 'Summer', value: SeasonName.SUMMER },
            { label: 'Fall', value: SeasonName.FALL },
         ],
         years: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
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
         this.loading = true;
         console.log(this.malSelected);
         const results =
            this.tab === 0
               ? [await SeriesService.createByMal(this.malSelected[0].malId)]
               : await SeriesService.createSeason(this.seasonSelected, this.selectedSeason, this.selectedYear);

         if (this.tab !== 0) {
            const newYear = await SettingService.setSettings('currentYear', this.selectedYear);
            const newSeason = await SettingService.setSettings('currentSeason', this.selectedSeason);

            await SettingsModule.setCurrentYear(newYear.value);
            await SettingsModule.setCurrentSeason(newSeason.value);
         }

         this.dialog = false;
         this.$emit('update:dialog', false);
         this.$emit('confirm', { results, clear: this.tab !== 0 });
         this.loading = false;
      },

      async onMalSearch(text) {
         console.log(this.search);
         this.searching = true;

         const results = await SeriesService.searchMAL(text);

         this.$set(this, 'malAnime', results);

         this.searching = false;
      },

      async onSeasonSearch() {
         this.searching = true;

         const results = await SeriesService.searchMALBySeason(this.selectedSeason, this.selectedYear);

         this.$set(this, 'seasonAnime', results);

         this.searching = false;
      },

      onSelected(selected, name) {
         this.$set(this, `${name}Selected`, selected);
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

.search-collection {
   height: 610px;
   padding: 21px;

   overflow-y: scroll;
}

.season-body,
.search-body {
   padding: 20px;
}

.loader {
   position: relative;
   opacity: 0.25;
   background-color: gray;
   pointer-events: none;
}

.progress-block {
   position: absolute;
   width: 100%;
   height: 100%;
   z-index: 1;

   > div {
      top: 50%;
      left: 50%;
   }
}

.button {
   margin-top: 15px;
}
</style>
