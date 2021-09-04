<template>
  <div class="shows q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-3">
        <series-card></series-card>
      </div>
      <div class="col-12 col-md-3">
        <series-card></series-card>
      </div>
      <div class="col-12 col-md-3">
        <series-card></series-card>
      </div>
      <div class="col-12 col-md-3">
        <series-card></series-card>
      </div>
      <div class="col-12 col-md-3">
        <series-card></series-card>
      </div>
      <div class="col-12 col-md-3">
        <series-card></series-card>
      </div>
      <div class="col-12 col-md-3">
        <series-card></series-card>
      </div>
      <div class="col-12 col-md-3">
        <series-card></series-card>
      </div>
      <div class="col-12 col-md-3">
        <series-card></series-card>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { SeriesCard } from '~/components/series';

export default defineComponent({
  name: 'show',
  components: { SeriesCard }
});
</script>

<style scoped lang="scss">
.shows {
  margin: 20px;
}
</style>
