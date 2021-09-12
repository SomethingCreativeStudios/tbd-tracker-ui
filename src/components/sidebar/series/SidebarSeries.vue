<template>
  <div class="sidebar-series">
    <div class="text-h6 title">{{ startingSeries.name }}</div>
    <div class="row row_body">
      <div class="row_body--body">
        <div class="row q-col-gutter-lg">
          <q-input class="col-12 col-md-3" color="secondary" label="Score" v-model="series.score" type="number" dense />
          <q-input class="col-12 col-md-3" color="secondary" label="Downloaded" v-model="series.downloaded" type="number" dense />
          <q-input class="col-12 col-md-3" color="secondary" label="Total" v-model="series.numberOfEpisodes" type="number" dense />
          <q-input class="col-12 col-md-3" color="secondary" label="MAL Id" v-model="series.malId" type="number" dense />
        </div>

        <q-separator color="secondary" inset />

        <div class="row">
          <q-input class="col-12" label="Name" color="secondary" v-model="series.name" dense />
          <q-select
            class="col-12"
            label="Alt Names"
            color="secondary"
            v-model="series.otherNames"
            use-input
            use-chips
            multiple
            @new-value="onNewValue('otherNames', $event)"
          />
          <q-input class="col-12" color="secondary" label="Description" v-model="series.description" autogrow dense />
        </div>

        <q-separator color="secondary" inset />

        <div class="row q-col-gutter-lg">
          <q-input class="col-12 col-md-6" color="secondary" label="Studio" v-model="series.studio" dense />
          <q-input class="col-12 col-md-6" color="secondary" v-model="series.airingData" mask="date" :rules="['date']" dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="series.airingData">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <q-separator color="secondary" inset />

        <q-select label="Genres" color="secondary" v-model="series.genres" use-input use-chips multiple @new-value="onNewValue('genres', $event)" />
        <q-select label="Tags" color="secondary" v-model="series.tags" use-input use-chips multiple @new-value="onNewValue('tags', $event)" />

        <q-separator color="secondary" inset />

        <q-input label="Image Url" color="secondary" v-model="series.imageUrl" dense />
        <q-select
          label="Folder Path"
          color="secondary"
          v-model="series.folderPath"
          :options="folderNames"
          use-input
          @new-value="onNewValue('tags', $event)"
        >
          <template v-slot:append>
            <q-btn round dense flat icon="add" @click="onFolderAdd" />
          </template>
        </q-select>
      </div>
    </div>
    <div class="no-wrap sidebar-actions row">
      <q-btn class="col-4" flat color="secondary" @click="onUpdate">Update</q-btn>
      <q-btn class="col-4" flat @click="onSync">Sync With Mal</q-btn>
      <q-btn class="col-4" flat color="negative" @click="onCancel">Cancel</q-btn>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue';
import { clone, equals } from 'ramda';
import { diff } from 'deep-object-diff';
import { useSeries, useSetting, useSidebar } from '~/composables';
import { Series } from '~/types/series/series.model';
import { SidebarType } from '~/types/sidebar/sidebar.enum';

const { getSeries, updateShow, syncWithMal } = useSeries();
const { getFolderNames } = useSetting();
const { setType } = useSidebar();

export default defineComponent({
  name: 'sidebar-series',
  props: {
    id: {
      type: Number,
      default: 0
    }
  },

  setup(props) {
    const updatedSeries = ref({} as Series);
    const foundSeries = computed(() => getSeries.value?.find(series => series.id === props.id));

    updatedSeries.value = clone(foundSeries.value) as Series;

    const seriesWatch = watch(foundSeries, newSeries => {
      if (equals(updatedSeries.value, newSeries)) return;
      updatedSeries.value = clone(foundSeries.value) as Series;
    });

    onMounted(() => {
      seriesWatch();
    });

    return { series: updatedSeries, startingSeries: foundSeries, folderNames: getFolderNames };
  },

  methods: {
    onChange(key, value) {
      this.updatedSeries[key] = value;
    },
    onNewValue(key, val) {
      this.series[key].push(val);
    },
    onSync() {
      syncWithMal(this.series.id);
    },
    onFolderAdd() {
      console.log('1 2 and Folder Add');
    },
    onUpdate() {
      const keysThatChanged = Object.keys(diff(this.startingSeries, this.series));
      updateShow(keysThatChanged.reduce((acc, key) => ({ ...acc, [key]: this.series[key] }), { id: this.series.id }));
      setType(SidebarType.NONE);
    },
    onCancel() {
      setType(SidebarType.NONE);
    }
  }
});
</script>

<style scoped>
.sidebar-series {
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
</style>
