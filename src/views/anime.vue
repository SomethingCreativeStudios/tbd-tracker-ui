<template>
   <div class="anime">
      <anime-collection :series="series"></anime-collection>
      <anime-search-dialog @confirm="addShow">
         <template #activator="{attrs, on}">
            <v-btn fab class="fab-button" v-bind="attrs" v-on="on"> <v-icon color="green">fas fa-plus</v-icon></v-btn>
         </template>
      </anime-search-dialog>
   </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { createFromId } from '~/compositions/series/series';
import { AnimeCollection, AnimeSearchDialog } from '~/components/anime';
import { AnimeModule } from '~modules/anime';

export default Vue.extend({
   name: 'anime',
   components: { AnimeCollection, AnimeSearchDialog },
   computed: {
      ...mapState({
         series: ({ anime }) => anime.shows,
      }),
   },
   methods: {
      async addShow({ type, results }) {
         if (type === 'mal') {
            AnimeModule.addShows([await createFromId(results.malId)]);
         } else {
            AnimeModule.addShows(results.series);
         }
      },
   },
});
</script>

<style lang="scss" scoped>
.anime {
   overflow-y: scroll;
   height: 94vh;
}

.fab-button {
   position: absolute;
   bottom: 2%;
   right: 1%;

   z-index: 6;

   height: 102px;
   width: 102px;
}

@media only screen and (max-width: 600px) {
   .anime {
      overflow-y: scroll;
      height: 94vh;
   }

   .fab-button {
      position: absolute;

      z-index: 6;

      height: 72px;
      width: 72px;
      top: 0;
   }
}
</style>
