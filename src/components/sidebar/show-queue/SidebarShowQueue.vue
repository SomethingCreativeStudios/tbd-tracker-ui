<template>
  <div class="sidebar-show-queue">
    <div class="text-h6 title">{{ series.name }}</div>
    <div class="row row_body">
      <div class="row_body--body">
        <template v-for="item in nyaaItems" :key="item.downloadLink">
          <q-item clickable v-ripple @click="onItem(item)">
            <q-item-section>
              <q-item-label>{{ item.itemName }}</q-item-label>
              <q-item-label caption>{{ item.subGroupName }}</q-item-label>
            </q-item-section>
            <q-item-section side v-if="handlingIgnored">
              <q-toggle color="green" v-model="item.isIgnored" @update:model-value="onItem(item)" />
            </q-item-section>
          </q-item>
        </template>
      </div>
    </div>
    <div class="no-wrap sidebar-actions row">
      <q-btn class="col-4" flat @click="onShow">Toggle Ignored</q-btn>
      <q-btn class="col-4" flat @click="onSync">Sync</q-btn>
      <q-btn class="col-4" flat color="negative" @click="onCancel">Cancel</q-btn>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useSeries, useSidebar } from '~/composables';
import { NyaaItem } from '~/types/nyaa/nyaa-item.model';
import { SidebarType } from '~/types/sidebar/sidebar.enum';
import { service as NyaaService } from '~/services/nyaa.service';

const { getSeries, toggleIgnored, getFilteredQueue } = useSeries();
const { setType } = useSidebar();

export default defineComponent({
  name: 'sidebar-show-queue',
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },

  setup(props) {
    const handlingIgnored = ref(false);
    const foundSeries = computed(() => getSeries.value?.find((series) => series.id === props.id));

    return { handlingIgnored, series: foundSeries, nyaaItems: computed(() => getFilteredQueue(props.id, handlingIgnored.value).value) };
  },

  methods: {
    onShow() {
      this.handlingIgnored = !this.handlingIgnored;
    },
    onCancel() {
      setType(SidebarType.NONE);
    },
    onItem(item: NyaaItem) {
      if (this.handlingIgnored) {
        if (item.isIgnored) {
          NyaaService.unignoreItem(item.downloadLink);
        } else {
          NyaaService.ignoreItem(item.downloadLink);
        }
        toggleIgnored(this.id, item.downloadLink);
        return;
      }

      console.log('1 2 and Item');
      NyaaService.download(this.id, item.downloadLink, item.itemName);
    },
    onSync() {
      NyaaService.syncShow(this.id);
    },
  },
});
</script>

<style scoped>
.sidebar-show-queue {
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

.q-item {
  margin-bottom: 30px;
}
</style>
