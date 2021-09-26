<template>
  <div class="shows q-pa-md">
    <div class="row settings q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-select label="Season" color="secondary" v-model="searchModel.season" @update:model-value="onSeason" :options="seasons" />
      </div>
      <div class="col-12 col-md-6">
        <div class="row">
          <div class="col-10">
            <q-select
              label="Year"
              color="secondary"
              v-model="searchModel.year"
              @update:model-value="onSeason"
              :options="['2021', '2022', '2023', '2024', '2025', '2026', '2027']"
            />
          </div>
          <div class="col-2">
            <q-icon class="series-card__sync" :name="`fas fa-sync`" @click="onSync" />
          </div>
        </div>
      </div>
    </div>
    <div class="row q-col-gutter-lg">
      <template v-for="show in series" :key="show.id">
        <div class="col-12 col-md-3">
          <series-card
            :airing-data="show.airingData"
            :next-airing-date="show.nextAiringDate"
            :current-ep="String(show.downloaded)"
            :description="show.description"
            :total="String(show.numberOfEpisodes)"
            :shows-to-download="show.showQueue.length"
            :id="show.id"
            :title="show.name"
            :image-url="show.imageUrl"
            :tags="[].concat(show.tags)"
          ></series-card>
        </div>
      </template>
    </div>
    <q-fab color="secondary" class="floating-button" icon="keyboard_arrow_up" direction="up">
      <q-fab-action color="secondary" @click="onAddShow" label="Add Show" icon="fas fa-search-plus" />
      <q-fab-action color="secondary" @click="onAddSeason" label="Add Season" icon="fas fa-folder-plus" />
    </q-fab>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { service as NyaaService } from '~/services/nyaa.service';
import { useSeries, useSidebar, useSetting } from '~/composables';
import { SeriesCard } from '~/components/series';
import { SidebarType } from '~/types/sidebar/sidebar.enum';
import { SeasonName } from '~/types/season/season-name.enum';

const { setType } = useSidebar();
const { getCurrentSeason, getCurrentYear, setCurrentSeason, setCurrentYear } = useSetting();

export default defineComponent({
  name: 'show',
  components: { SeriesCard },
  setup() {
    const searchModel = ref({ season: getCurrentSeason.value, year: getCurrentYear.value });
    const { getSeries } = useSeries();

    return { series: getSeries, searchModel, seasons: [SeasonName.FALL, SeasonName.WINTER, SeasonName.SUMMER, SeasonName.SPRING] };
  },
  methods: {
    onAddShow() {
      console.log('1 2 and Add Show');
      setType(SidebarType.ADD_SHOW);
    },
    onAddSeason() {
      console.log('1 2 and Add Season');
      setType(SidebarType.ADD_SEASON);
    },
    async onSeason() {
      await setCurrentSeason(this.searchModel.season);
      await setCurrentYear(Number(this.searchModel.year));

      //@ts-ignore
      await window.refresh();
    },
    onSync() {
      console.log('1 2 and Sync All');
      NyaaService.syncShow();
    }
  }
});
</script>

<style scoped lang="scss">
.shows {
  margin: 20px;
}
.floating-button {
  position: fixed;
  bottom: 30px;
  right: 40px;
}

.settings {
  margin-bottom: 25px;
}

.series-card__sync:hover {
  cursor: pointer;
}

.series-card__sync {
  color: #f7b40e;
  position: relative;
  top: 24px;
  left: 35px;
  font-size: 30px;
}
</style>
