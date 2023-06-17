<template>
  <div class="sidebar-search-series">
    <div class="text-h6 title">
      Add Series
      <q-input outlined color="secondary" label="Search" @change="onSearch" />
      <q-linear-progress v-if="loading" indeterminate color="secondary" class="q-mt-sm" />
    </div>
    <div class="row row_body">
      <div class="row_body--body">
        <template v-for="show in results" :key="show.name">
          <q-item clickable v-ripple @click="onAddShow(show)">
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
      <q-btn class="col-12" flat color="negative" @click="onCancel">Cancel</q-btn>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useSeries, useSidebar, useSetting } from '~/composables';
import { SidebarType } from '~/types/sidebar/sidebar.enum';
import { service as SearchService } from '~/services/query.service';
import { service as SeriesService } from '~/services/series.service';
import { service as NyaaService } from '~/services/nyaa.service';
import { Series } from '~/types/series/series.model';

const { setUp } = useSeries();
const { getCurrentYear, getCurrentSeason } = useSetting();
const { setType } = useSidebar();

export default defineComponent({
  name: 'sidebar-search-series',

  setup() {
    const loading = ref(false);
    const results = ref([] as Series[]);

    return { loading, results };
  },

  methods: {
    onAdd() {
      console.log('1 2 and Add');
    },
    onCancel() {
      setType(SidebarType.NONE);
    },
    async onSearch(text: string) {
      this.loading = true;
      this.results = await SearchService.searchByName(text);
      this.loading = false;
    },
    async onAddShow(item: Series) {
      await SeriesService.createByMal({ malId: item.malId, seasonYear: getCurrentYear.value, seasonName: getCurrentSeason.value });
      const links = await NyaaService.fetchIgnoreLinks();
      await setUp(links);
      setType(SidebarType.NONE);
    },
  },
});
</script>

<style scoped>
.sidebar-search-series {
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
</style>
