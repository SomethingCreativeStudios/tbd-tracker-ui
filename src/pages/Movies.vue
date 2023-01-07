<template>
  <div class="movies q-pa-md">
    <div class="row q-col-gutter-lg" style="display: flex; flex-direction: column">
      <div class="row_body--search row">
        <q-input style="flex: 11" v-model="query" filled label="Search Query..." />
        <q-btn style="flex: 1" color="primary" text-color="white" label="Search" @click="onSearch()" />
      </div>
      <div class="row_body--quick-links row">
        <template v-for="link in quickLinks" :key="link.query">
          <q-btn color="primary" text-color="white" :label="link.display" @click="onSearch(link.query)" />
        </template>
      </div>
      <div class="row_body--body row q-col-gutter-lg">
        <template v-if="isLoading">
          <q-inner-loading :showing="isLoading" label="Please wait..." label-class="text-teal" label-style="font-size: 3.1em" size="18vw" />
        </template>
        <template v-else v-for="result in results" :key="result.link + result.selectedItem + results.items?.length">
          <div class="col-12 col-md-3">
            <movie-card
              :image-path="result.items[result.selectedItem || 0]?.imagePath"
              :description="result.items[result.selectedItem || 0]?.description"
              :display-name="result.items[result.selectedItem || 0]?.displayName"
              :release-date="new Date(result.items[result.selectedItem || 0]?.releaseDate)"
              :alternative-count="result.items.length"
              :name="result.name"
              :link="result.link"
              :parsed-resolution="result.parsedResolution"
              :parsed-name="result.parsedName"
            ></movie-card>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useSidebar, useMovies } from '~/composables';
import { SidebarType } from '~/types/sidebar/sidebar.enum';
import { service as MovieService } from '~/services/movie.service';
import { MediaQuickLink, SourceLocation } from '~/types/movie/movie.models';

import { MovieCard } from '~/components/movies';

const { setType } = useSidebar();
const { setResults, getResults } = useMovies();

export default defineComponent({
  name: 'movies',
  components: { MovieCard },
  setup() {
    const query = ref('');
    const quickLinks = ref([] as MediaQuickLink[]);
    const isLoading = ref(false);

    MovieService.findQuickLinks().then((links) => (quickLinks.value = links));

    return { isLoading, query, quickLinks, results: getResults() };
  },
  methods: {
    onAddShow() {
      setType(SidebarType.ADD_SHOW);
    },
    onAddSeason() {
      setType(SidebarType.ADD_SEASON);
    },
    async onSearch(query = this.query) {
      this.isLoading = true;
      const results = await MovieService.search(query, SourceLocation.THE_PIRATE_BAY);
      this.isLoading = false;

      setResults(results);
    },
  },
});
</script>

<style scoped lang="scss">
.movies {
  margin: 20px;
}

.floating-button {
  position: fixed;
  bottom: 30px;
  right: 40px;
}

.row_body--body {
  width: 100%;
  overflow: auto;
  padding-right: 20px;
  height: 71vh;
}

.row_body--quick-links {
  display: flex;
  padding-bottom: 37px;
  column-gap: 20px;
}

.row_body--search {
  display: flex;
  width: 100%;
  column-gap: 20px;
}
</style>
