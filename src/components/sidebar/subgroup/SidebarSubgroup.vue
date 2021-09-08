<template>
  <div class="sidebar-subgroups">
    <div class="text-h6 title">Subgroups: {{ series.name }}</div>
    <div class="row row_body">
      <div class="row_body--body">
        <template v-for="group in subgroups" :key="group.id">
          <subgroup-card v-bind="group"></subgroup-card>
        </template>
      </div>
    </div>
    <div class="no-wrap sidebar-actions row">
      <q-btn class="col-6" flat color="secondary" @click="onAddGroup">Add</q-btn>
      <q-btn class="col-6" flat color="negative" @click="onCancel">Close</q-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { SubgroupCard } from './components';
import { useSeries, useSidebar, useSubgroup } from '~/composables';
import { SidebarType } from '~/types/sidebar/sidebar.enum';

const { getSeries } = useSeries();
const { getSubgroups } = useSubgroup();
const { setType } = useSidebar();

export default defineComponent({
  name: 'sidebar-subgroups',
  components: { SubgroupCard },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const foundSeries = computed(() => getSeries.value?.find(series => series.id === props.id));
    const foundSubgroups = computed(() => getSubgroups.value?.[props.id] ?? []);

    return { series: foundSeries, subgroups: foundSubgroups };
  },
  methods: {
    onAddGroup() {
      console.log('1 2 and Add');
    },
    onCancel() {
      setType(SidebarType.NONE);
    }
  }
});
</script>

<style scoped>
.sidebar-subgroups {
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
