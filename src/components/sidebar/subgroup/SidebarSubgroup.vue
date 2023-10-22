<template>
  <div class="sidebar-subgroups">
    <div class="text-h6 title">Subgroups: {{ series.name }}</div>
    <div class="row row_body">
      <div class="row_body--body">
        <q-expansion-item v-if="suggestedSeries.length" icon="far fa-question-circle" label="Suggested Groups">
          <template v-for="suggestion in suggestedSeries" :key="'reg' + suggestion.subgroup.name + suggestion.subgroup.preferedResultion">
            <q-item clickable v-ripple @click="onItem(suggestion)">
              <q-item-section>
                <q-item-label :class="{ trusted: suggestion.isTrusted, remake: suggestion.isRemake }">{{ suggestion.subgroup.name }}</q-item-label>
                <q-item-label caption>{{ suggestion.subgroup.preferedResultion }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-expansion-item>

        <q-expansion-item v-if="recentSuggestSeries.length" icon="far fa-question-circle" label="Brute Suggested Groups">
          <template v-for="suggestion in recentSuggestSeries" :key="'brute' + suggestion.subgroup.name + suggestion.subgroup.preferedResultion">
            <q-item clickable v-ripple @click="onItem(suggestion)">
              <q-item-section>
                <q-item-label :class="{ trusted: suggestion.isTrusted, remake: suggestion.isRemake }">{{ suggestion.subgroup.name }} - {{ suggestion.subgroup.rules[0].text }}</q-item-label>
                <q-item-label caption>{{ suggestion.subgroup.preferedResultion }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-expansion-item>

        <template v-for="group in subgroups" :key="group.id">
          <subgroup-card v-bind="group"></subgroup-card>
        </template>
      </div>
    </div>
    <div class="no-wrap sidebar-actions row">
      <q-btn class="col-3" flat color="secondary" @click="onAddGroup">Add</q-btn>
      <q-btn class="col-3" flat @click="onSuggest">Suggest</q-btn>
      <q-btn class="col-3" flat color="yellow" @click="onForceSuggest">Force Suggest</q-btn>
      <q-btn class="col-3" flat color="negative" @click="onCancel">Close</q-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import { SubgroupCard } from './components';
import { useSeries, useSidebar, useSubgroup, useSetting, useSubgroupRule } from '~/composables';
import { SidebarType } from '~/types/sidebar/sidebar.enum';
import { service as NyaaService } from '~/services/nyaa.service';

const { getSeries } = useSeries();
const { getSubgroups, createSubgroup } = useSubgroup();
const { createRule } = useSubgroupRule();
const { setType } = useSidebar();
const { getDefaultSubgroup } = useSetting();

export default defineComponent({
  name: 'sidebar-subgroups',
  components: { SubgroupCard },
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const suggestedSeries = ref([]);
    const recentSuggestSeries = ref([]);
    const foundSeries = computed(() => getSeries.value?.find((series) => series.id === props.id));
    const foundSubgroups = computed(() => getSubgroups.value?.[props.id] ?? []);

    return { series: foundSeries, subgroups: foundSubgroups, suggestedSeries, recentSuggestSeries };
  },
  methods: {
    onAddGroup() {
      console.log('1 2 and Add');
      createSubgroup({ seriesId: this.id, name: getDefaultSubgroup.value || 'Subgroup', preferedResultion: '1080' });
    },
    async onSuggest() {
      const groups = await NyaaService.suggestSubgroups(this.series.name, this.series.otherNames);
      const cleaned = groups.reduce((acc, group) => {
        const has = acc.find((found) => found.name === found.subgroup.name && found.preferedResultion === found.subgroup.preferedResultion);

        return has ? acc : acc.concat(group);
      }, []);

      this.suggestedSeries = cleaned;
    },
    async onForceSuggest() {
      const groups = await NyaaService.suggestFromRecentSubgroups();
      const cleaned = groups.reduce((acc, group) => {
        const has = acc.find((found) => found.name === found.subgroup.name && found.preferedResultion === found.subgroup.preferedResultion);

        return has ? acc : acc.concat(group);
      }, []);

      this.recentSuggestSeries = cleaned;
      console.log(this.recentSuggestSeries);
    },
    onCancel() {
      setType(SidebarType.NONE);
    },
    async onItem({ subgroup }) {
      const group = await createSubgroup({ seriesId: this.id, name: subgroup.name, preferedResultion: subgroup.preferedResultion });
      createRule({ subgroupId: group.id, rules: subgroup.rules });
    },
  },
});
</script>

<style scoped>
.sidebar-subgroups {
  margin: 10px;

  overflow: hidden;
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
  width: 100%;
}

.row_body--body {
  width: 100%;
  position: absolute;
}

.subgroup-card {
  margin-bottom: 20px;
}

.q-separator {
  margin-top: 20px;
  margin-bottom: 20px;
}

.q-item__label.trusted {
  color: green;
}

.q-item__label.remake {
  color: purple;
}
</style>
