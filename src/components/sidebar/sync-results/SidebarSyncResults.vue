<template>
  <div class="sidebar-sync-results">
    <div class="text-h6 title">
      Sync Local
      <q-linear-progress v-if="loading" indeterminate color="secondary" class="q-mt-sm" />
    </div>
    <div class="row row_body">
      <div class="row_body--body">
        <template v-for="show in results" :key="show.folderName">
          <q-item
            clickable
            v-ripple
            @click="onAddShow(show.options[0].malId)"
            :class="`item--${isSelected(show.options[0].malId) ? 'selected' : 'not-selected'}`"
          >
            <q-card-section class="series-card__body" horizontal>
              <q-img :src="show.options[0].imagePath" loading="lazy">
                <div class="series-card__title absolute-bottom text-subtitle2 text-center">
                  {{ show.options[0].name }}
                </div>
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">RIP Image</div>
                  <div class="series-card__title absolute-bottom text-subtitle2 text-center">
                    {{ show.options[0].name }}
                  </div>
                </template>
              </q-img>
              <q-card-section>
                <div class="series-card__title">
                  {{ show.folderName }}
                </div>
                <div class="series-card__description">
                  {{ show.options[0].description }}
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
import { useSeries, useSidebar, useGlobal, useSetting } from '~/composables';
import { SidebarType } from '~/types/sidebar/sidebar.enum';
import { service as SeriesService } from '~/services/series.service';
import { SyncResultsDTO } from '~/types/series/dto/SyncResultsDTO';

const { setType } = useSidebar();
const { getCurrentSeason, getCurrentYear } = useSetting();
const { createBySeason } = useSeries();
const { setUpStores } = useGlobal();

export default defineComponent({
  name: 'sidebar-sync-results',

  setup() {
    const loading = ref(false);
    const results = ref([] as SyncResultsDTO[]);
    const selected = ref([] as number[]);

    const onSync = async () => {
      loading.value = true;
      results.value = await SeriesService.syncLocal();
      loading.value = false;
    };

    onSync();

    return { loading, results, selected };
  },

  methods: {
    onAdd() {
      console.log('1 2 and Add');
    },
    onCancel() {
      setType(SidebarType.NONE);
    },
    async onSync() {},
    async onAddSeason() {
      const folderMap = this.selected.reduce((acc, malId) => {
        const result = this.results.find((result) => result.options[0].malId === malId);
        return { [malId]: result.folderName, ...acc };
      });

      await createBySeason({ seasonName: getCurrentSeason.value, seasonYear: getCurrentYear.value, malIds: this.selected, folderMap });
      await setUpStores();
      setType(SidebarType.NONE);
    },
    onAddShow(id: number) {
      const indexOf = this.selected.indexOf(id);

      if (indexOf > -1) {
        this.selected = this.selected.filter((_, index) => index !== indexOf);
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
.sidebar-sync-results {
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
