<template>
  <div class="sidebar-search-season">
    <div class="text-h6 title">
      Add Season
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <q-select label="Season" color="secondary" v-model="search.season" :options="seasons" />
        </div>
        <div class="col-12 col-md-6">
          <q-select label="Year" color="secondary" v-model="search.year" :options="['2021', '2022', '2023', '2024', '2025', '2026', '2027']" />
        </div>
      </div>
      <div class="col-12">
        <q-btn class="search-btn" color="secondary" text-color="white" label="Search" @click="onSearch" />
      </div>
      <q-linear-progress v-if="loading" indeterminate color="secondary" class="q-mt-sm" />
    </div>
    <div class="row row_body">
      <div class="row_body--body">
        <template v-for="show in results" :key="show.name">
          <q-item clickable v-ripple @click="onAddShow(show.malId)" :class="`item--${isSelected(show.malId) ? 'selected' : 'not-selected'}`">
            <q-card-section class="series-card__body" horizontal>
              <q-img :src="show.imageUrl" loading="lazy">
                <div class="series-card__title absolute-bottom text-subtitle2 text-center">
                  {{ show.name }}
                </div>
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">RIP Image</div>
                  <div class="series-card__title absolute-bottom text-subtitle2 text-center">
                    {{ show.name }}
                  </div>
                </template>
              </q-img>
              <q-card-section>
                <div class="series-card__description">
                  {{ show.description }}
                </div>
              </q-card-section>
            </q-card-section>
          </q-item>
        </template>
      </div>
    </div>
    <div class="no-wrap sidebar-actions row">
      <q-btn class="col-6" flat color="secondary" @click="onAddSeason">Add Shows</q-btn>
      <q-btn class="col-6" flat color="negative" @click="onCancel">Cancel</q-btn>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useSeries, useSidebar, useGlobal } from '~/composables';
import { SidebarType } from '~/types/sidebar/sidebar.enum';
import { service as SearchService } from '~/services/query.service';
import { Series } from '~/types/series/series.model';
import { SeasonName } from '~/types/season/season-name.enum';

const { setType } = useSidebar();
const { createBySeason } = useSeries();
const { setUpStores } = useGlobal();

export default defineComponent({
  name: 'sidebar-search-season',

  setup() {
    const search = ref({ season: '', year: '' });
    const loading = ref(false);
    const results = ref([] as Series[]);
    const selected = ref([] as number[]);

    return { loading, search, results, selected, seasons: [SeasonName.FALL, SeasonName.WINTER, SeasonName.SUMMER, SeasonName.SPRING] };
  },

  methods: {
    onAdd() {
      console.log('1 2 and Add');
    },
    onCancel() {
      setType(SidebarType.NONE);
    },
    async onSearch() {
      this.loading = true;
      this.results = await SearchService.searchBySeason({ season: this.search.season, year: this.search.year });
      this.loading = false;
    },
    async onAddSeason() {
      await createBySeason({ seasonName: this.search.season, seasonYear: this.search.year, malIds: this.selected });
      await setUpStores();
      setType(SidebarType.NONE);
    },
    onAddShow(id: number) {
      const indexOf = this.selected.indexOf(id);

      if (indexOf > -1) {
        this.selected.splice(indexOf);
      } else {
        this.selected.push(id);
      }
    },
    isSelected(showId: number) {
      return this.selected.find((id) => id === showId) !== undefined;
    },
  },
});
</script>

<style scoped>
.sidebar-search-season {
  margin: 10px;

  display: grid;
  grid-template-rows: min-content 1fr;
  grid-auto-flow: column;
  height: 90%;
}

.title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  padding-bottom: 20px;
}

.sidebar-actions {
  position: fixed;
  width: 100%;
  bottom: 0px;
}

.series-card__body {
  height: 100%;

  display: inline-grid;
  grid-template-columns: 185px auto;
}

.series-card__title {
  line-height: 1;
}

.series-card__title:hover {
  cursor: pointer;
}

.series-card__description {
  margin-top: 10px;

  line-height: 1.2;
  overflow: hidden;
  height: 221px;
}

.series-card__description:hover {
  overflow: auto;
}

.row_body {
  position: relative;
  overflow: auto;
}

.row_body--body {
  width: 100%;
  position: absolute;
}
.q-separator {
  margin-top: 20px;
  margin-bottom: 20px;
}

.q-item {
  margin-bottom: 30px;
}

.search-btn {
  width: 100%;
  margin-top: 10px;
}

.item--selected {
  border: 5px solid #5da25d;
}
</style>
