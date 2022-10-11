<template>
  <div class="shows q-pa-md">
    <div class="row settings q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-select
          label="Season"
          color="secondary"
          v-model="currentSeason"
          @update:model-value="($event) => onSeason($event, 'season')"
          :options="seasons"
        />
      </div>
      <div class="col-12 col-md-6">
        <div class="row">
          <div class="col-10">
            <q-select
              label="Year"
              color="secondary"
              v-model="currentYear"
              @update:model-value="($event) => onSeason($event, 'year')"
              :options="[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027]"
            />
          </div>
          <div class="col-1">
            <q-icon class="series-card__sync series-card--icon" :name="`fas fa-sync`" @click="onSync" />
          </div>
          <div class="col-1">
            <q-icon class="series-card__signin series-card--icon" :name="`fas fa-sign-in-alt`" @click="onSignIn" />
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
import { service as MalService } from '~/services/mal.service';
import { useSeries, useSidebar, useSetting, useGlobal } from '~/composables';
import { SeriesCard } from '~/components/series';
import { SidebarType } from '~/types/sidebar/sidebar.enum';
import { SeasonName } from '~/types/season/season-name.enum';

const { setType } = useSidebar();
const { getCurrentSeason, getCurrentYear, setCurrentSeason, setCurrentYear } = useSetting();
const { reload } = useGlobal();

export default defineComponent({
  name: 'show',
  components: { SeriesCard },
  setup() {
    const searchModel = ref({ season: getCurrentSeason.value, year: getCurrentYear.value });
    const { getSeries } = useSeries();

    return {
      series: getSeries,
      searchModel,
      currentSeason: getCurrentSeason,
      currentYear: getCurrentYear,
      seasons: [SeasonName.FALL, SeasonName.WINTER, SeasonName.SUMMER, SeasonName.SPRING],
    };
  },
  methods: {
    onAddShow() {
      setType(SidebarType.ADD_SHOW);
    },
    onAddSeason() {
      setType(SidebarType.ADD_SEASON);
    },
    async onSeason(newValue: string, field: string) {
      if (field === 'season') {
        await setCurrentSeason(newValue as any);
      } else {
        await setCurrentYear(Number(newValue));
      }

      //@ts-ignore
      await reload();
    },
    onSync() {
      NyaaService.syncShow();
    },
    async onSignIn() {
      const { url } = await MalService.getAuthURL();

      window.location.href = decodeURIComponent(url);
    },
  },
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

.series-card--icon:hover {
  cursor: pointer;
}

.series-card__signin,
.series-card__sync {
  color: #f7b40e;
  position: relative;
  top: 24px;
  left: 35px;
  font-size: 30px;
}
</style>
