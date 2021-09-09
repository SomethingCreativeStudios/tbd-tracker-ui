<template>
  <q-card class="subgroup-card">
    <q-card-section class="subgroup-card__body" horizontal>
      <div class="row q-col-gutter-lg subgroup-card__body--title-block">
        <q-input class="col-12 col-md-9" label="Name" v-model="group.name" dense />
        <q-select class="col-12 col-md-3" label="Resolution" :options="resOptions" v-model="group.preferedResultion" dense />
      </div>
      <div class="subgroup-card__rules">
        <template v-for="rule in rules" :key="rule.id">
          <subgroup-rule-card v-bind="rule" :subgroup-id="id"></subgroup-rule-card>
        </template>
      </div>
    </q-card-section>
    <q-card-actions class="subgroup-card__actions no-wrap">
      <q-btn flat color="secondary" @click="onAddRule">Add Rule</q-btn>
      <q-btn flat color="negative" @click="onDelete">Delete</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent, computed, ref, watch } from 'vue';
import debounce from 'debounce';
import { useSubgroupRule, useSubgroup } from '~/composables';
import SubgroupRuleCard from '../subgroup-rule-card';
import { RuleType } from '~/types/sub-group-rule/rule-type.enum';

const { updateSubgroup } = useSubgroup();
const { getSubgroupRules, createRule } = useSubgroupRule();

export default defineComponent({
  name: 'subgroup-card',
  components: { SubgroupRuleCard },
  props: {
    id: {
      type: Number,
      default: -1
    },
    name: {
      type: String,
      default: ''
    },
    preferedResultion: {
      type: String,
      default: '1080'
    }
  },

  setup(props) {
    const updatedGroup = ref({ name: props.name, preferedResultion: props.preferedResultion });

    watch(
      updatedGroup.value,
      debounce(() => updateSubgroup({ id: props.id, name: updatedGroup.value.name, preferedResultion: updatedGroup.value.preferedResultion }), 1000)
    );

    return { group: updatedGroup, resOptions: ['1080', '720', '480'], rules: computed(() => getSubgroupRules.value[props.id] || []) };
  },
  methods: {
    onAddRule() {
      console.log('1 2 and Add Rule');
      createRule({ subgroupId: this.id, rules: [{ text: '', ruleType: RuleType.STARTS_WITH, isPositive: true }] });
    },
    onDelete() {
      console.log('1 2 and Delete');
    }
  }
});
</script>

<style scoped>
.subgroup-card {
  box-sizing: border-box;
  background: #2f2f2f;
}

.subgroup-card__actions {
  justify-content: center;
}

.subgroup-card__body--title-block {
  width: 100%;
  padding: 20px;
}

.subgroup-card__body {
  display: flex;
  flex-direction: column;
}
.subgroup-card__rules {
  display: flex;
  flex-direction: column;

  margin-left: 20px;
  margin-right: 20px;
}
</style>
