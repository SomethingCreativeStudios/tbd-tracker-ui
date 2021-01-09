<template>
   <v-container class="anime-collection">
      <v-col>
         <div class="filter-controls">
            <v-select :items="sortByItems" :label="'Sort By'" v-model="sortBy" @change="onSort"></v-select>
         </div>
         <v-row class="anime-cards">
            <template v-for="anime in series">
               <v-col :key="anime.id" md="4">
                  <v-lazy
                     :options="{
                        threshold: 0.5,
                     }"
                     transition="fade-transition"
                  >
                     <anime-card v-bind="anime" @select="onSelect(anime, $event)" @delete="onDelete(anime)"></anime-card>
                  </v-lazy>
               </v-col>
            </template>
         </v-row>
      </v-col>
   </v-container>
</template>

<script>
import { mapState } from 'vuex';
import AnimeCard from '../anime-card';
import AnimeModule from '~/store/modules/anime/anime';
export default {
   name: 'anime-collection',
   components: { AnimeCard },
   props: {
      series: {
         type: Array,
         default: () => [],
      },
   },
   data() {
      return {
         selectMode: 'single',
         sortBy: 'Queue',
         sortByItems: ['Name', 'Queue', 'Watch Status'],
      };
   },
   computed: {
      ...mapState({
         selectedShows: ({ anime }) => anime.selectedShows || [],
      }),
   },
   methods: {
      onDelete({ id }) {
         AnimeModule.removeShowById(id);
      },
      onSort(sortBy) {
         AnimeModule.sortShows(sortBy);
      },
      onSelect({ id }, isSelected) {
         if (this.selectedShows.length === 1 && !isSelected) {
            AnimeModule.setSelected([]);
            AnimeModule.setSelectMode('single');
         } else if (isSelected) {
            AnimeModule.setSelectMode('multi');
            AnimeModule.setSelected(this.selectedShows.concat(id));
         } else if (!isSelected) {
            AnimeModule.setSelectMode('multi');
            AnimeModule.setSelected(this.selectedShows.filter(show => show != id));
         }
      },
   },
};
</script>

<style lang="scss" scoped>
.anime-collection {
   display: flex;
   flex-wrap: wrap;
}

.anime-cards {
   overflow-y: scroll;
   height: 82vh;
}
</style>
