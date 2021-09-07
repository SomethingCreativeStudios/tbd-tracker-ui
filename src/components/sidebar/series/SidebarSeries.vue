<template>
  <div class="sidebar-series">
    <q-input label="Name" v-model="series.name" dense />
    <q-input label="Studio" v-model="series.studio" dense />
    <q-input label="Score" v-model="series.score" type="number" dense />
    <q-input label="Downloaded" v-model="series.downloaded" type="number" dense />
    <q-input label="Total" v-model="series.numberOfEpisodes" type="number" dense />
    <q-input label="Description" v-model="series.description" autogrow dense />
    <q-input label="Image Url" v-model="series.imageUrl" dense />
    <q-se label="Folder Path" v-model="series.imageUrl" dense />
    <q-input v-model="series.airingData" mask="date" :rules="['date']" dense>
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
    <q-select label="Genres" v-model="series.genres" use-input use-chips multiple @new-value="onNewValue('genres', $event)" />
    <q-select label="Alt Names" v-model="series.otherNames" use-input use-chips multiple @new-value="onNewValue('otherNames', $event)" />
    <q-select label="Tags" v-model="series.tags" use-input use-chips multiple @new-value="onNewValue('tags', $event)" />
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue';
import { clone, equals } from 'ramda';
import { useSeries } from '~/composables';
import { Series } from '~/types/series/series.model';

const { getSeries } = useSeries();

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

    return { series: updatedSeries };
  },

  methods: {
    onChange(key, value) {
      this.updatedSeries[key] = value;
    },
    onNewValue(key, val) {
      this.series[key].push(val);
    }
  }
});
</script>

<style scoped>
.sidebar-series {
  margin: 10px;
}
</style>
