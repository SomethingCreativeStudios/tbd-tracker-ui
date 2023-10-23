<template>
  <div class="plex-shows q-pa-md">
    <div class="plex-shows__section row q-col-gutter-lg">
      <q-btn style="flex: 4" color="primary" text-color="white" label="Sync Movies" @click="onSync('movie')" />
      <q-btn style="flex: 4" color="primary" text-color="white" label="Sync TV Shows" @click="onSync('tv-show')" />
      <q-btn style="flex: 4" color="primary" text-color="white" label="Sync Anime" @click="onSync('anime')" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { LibraryType } from '~/types/plex/plex.model';
import { service as PlexService } from '~/services/plex.service';

export default defineComponent({
  name: 'page-plex',
  components: {},
  setup() {
    return {};
  },
  methods: {
    async onSync(type: LibraryType) {
      await PlexService.sync(type);
    },
  },
});
</script>

<style scoped lang="scss">
.plex-shows {
  margin: 20px;
}

.plex-shows__section {
  column-gap: 20px;
}
</style>
