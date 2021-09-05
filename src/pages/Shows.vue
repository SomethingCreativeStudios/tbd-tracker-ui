<template>
  <div class="shows q-pa-md">
    <div class="row q-col-gutter-lg">
      <template v-for="show in series" :key="show.id">
        <div class="col-12 col-md-3">
          <series-card
            :airing-data="show.airingData"
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
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useSeries } from '~/composables';
import { SeriesCard } from '~/components/series';

export default defineComponent({
  name: 'show',
  components: { SeriesCard },
  setup() {
    const { getSeries } = useSeries();
    return { series: getSeries };
  }
});
</script>

<style scoped lang="scss">
.shows {
  margin: 20px;
}
</style>
