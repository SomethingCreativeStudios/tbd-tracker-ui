<template>
  <div class="movies q-pa-md">
    <div class="row q-col-gutter-lg">I AM MOVIES</div>
    <q-fab color="secondary" class="floating-button" icon="keyboard_arrow_up" direction="up">
      <q-fab-action color="secondary" @click="onAddShow" label="Add Show" icon="fas fa-search-plus" />
      <q-fab-action color="secondary" @click="onAddSeason" label="Add Season" icon="fas fa-folder-plus" />
    </q-fab>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useSidebar } from '~/composables';
import { SidebarType } from '~/types/sidebar/sidebar.enum';

const { setType } = useSidebar();

export default defineComponent({
  name: 'movies',
  components: {},
  setup() {
    return {};
  },
  methods: {
    onAddShow() {
      setType(SidebarType.ADD_SHOW);
    },
    onAddSeason() {
      setType(SidebarType.ADD_SEASON);
    },
  },
});
</script>

<style scoped lang="scss">
.movies {
  margin: 20px;
}

.floating-button {
  position: fixed;
  bottom: 30px;
  right: 40px;
}
</style>
