<template>
  <div class="row q-col-gutter-lg subgroup-card__body--title-block">
    <q-input class="col-12 col-md-4" label="Query" v-model="rule.text" dense />
    <q-select class="col-12 col-md-3" label="Type" :options="ruleTypes" v-model="rule.ruleType" map-options emit-value dense behavior="menu" />
    <q-checkbox class="col-12 col-md-2" label="Match" v-model="rule.isPositive" dense />
    <q-icon class="subgroup-card__body--delete col-12 col-md-2" name="fas fa-trash" @click="onDelete"></q-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import debounce from 'debounce';
import { useSubgroupRule } from '~/composables';
import { RuleType } from '~/types/sub-group-rule/rule-type.enum';

const { removeRule, updateRule } = useSubgroupRule();

export default defineComponent({
  name: 'subgroup-card',
  props: {
    id: {
      type: Number,
      default: -1
    },
    text: {
      type: String,
      default: ''
    },
    isPositive: {
      type: Boolean,
      default: true
    },
    ruleType: {
      type: String as PropType<RuleType>,
      default: RuleType.STARTS_WITH
    },
    subgroupId: {
      type: Number,
      default: -1
    }
  },

  setup(props) {
    const rule = ref({ text: props.text, isPositive: props.isPositive, ruleType: props.ruleType });

    watch(
      rule.value,
      debounce(() => {
        updateRule(props.subgroupId, { id: props.id, text: rule.value.text, isPositive: rule.value.isPositive, ruleType: rule.value.ruleType });
      }, 1000)
    );

    return {
      ruleTypes: [
        { label: 'Starts With', value: RuleType.STARTS_WITH },
        { label: 'Contains', value: RuleType.CONTAINS },
        { label: 'Ends With', value: RuleType.ENDS_WITH },
        { label: 'Regex', value: RuleType.REGEX }
      ],
      rule
    };
  },
  methods: {
    onDelete() {
      console.log('1 2 and Delete');
      removeRule(this.id);
    }
  }
});
</script>

<style scoped>
.subgroup-rule-card {
  box-sizing: border-box;
}

.subgroup-rule-card__actions {
  justify-content: center;
}

.subgroup-rule-card__body--title-block {
  width: 100%;
  padding: 20px;
}

.subgroup-card__body--delete {
  cursor: pointer;
}
</style>
