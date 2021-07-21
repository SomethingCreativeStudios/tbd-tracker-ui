<template>
   <v-row class="subgroup-rule">
      <v-col cols="12" md="4">
         <v-text-field label="Text" :value="text" @change="onChange('text', $event)"></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
         <v-select
            label="Rule Type"
            :items="ruleTypes"
            :value="ruleType"
            @change="onChange('ruleType', $event)"
            item-text="text"
            item-value="value"
         ></v-select>
      </v-col>
      <v-col cols="12" md="2">
         <v-select
            label="Match Type"
            :items="[
               { text: 'Match', value: true },
               { text: 'No Match', value: false },
            ]"
            :value="isPositive"
            @change="onChange('isPositive', $event)"
            item-text="text"
            item-value="value"
         ></v-select>
      </v-col>
      <v-col cols="12" md="2">
         <v-row class="action-buttons" v-if="!$vuetify.breakpoint.mobile">
            <v-icon class="action-icon" @click="onSave">fas fa-save</v-icon>
            <v-icon class="action-icon" @click="onDelete">fas fa-trash</v-icon>
         </v-row>
         <v-row class="action-buttons" v-else>
            <v-btn class="action-icon" color="green" @click="onSave">Save</v-btn>
            <v-btn class="action-icon" color="red" @click="onDelete">Delete</v-btn>
         </v-row>
      </v-col>
   </v-row>
</template>

<script lang="ts">
import Vue from 'vue';

import { RuleType } from '~/models/subgroupRule';
import { AnimeModule } from '~/store/modules/anime';

export default Vue.extend({
   name: 'subgroup-rule',
   components: {},
   props: {
      id: {
         type: Number,
         default: 0,
      },
      showId: {
         type: Number,
         default: 0,
      },
      subgroupId: {
         type: Number,
         default: 0,
      },
      text: {
         type: String,
         default: '',
      },
      ruleType: {
         type: String,
         default: RuleType.STARTS_WITH,
      },
      isPositive: {
         type: Boolean,
         default: false,
      },
   },
   data() {
      return {
         updatedRule: {},
         ruleTypes: [
            { text: 'Contains', value: RuleType.CONTAINS },
            { text: 'Starts With', value: RuleType.STARTS_WITH },
            { text: 'Ends With', value: RuleType.ENDS_WITH },
            { text: 'Regex', value: RuleType.REGEX },
         ],
      };
   },
   methods: {
      onChange(field, value) {
         this.updatedRule = { [field]: value };
      },

      onSave() {
         AnimeModule.updateSubgroupRule({ id: this.id, ...this.updatedRule });
      },

      onDelete() {
         AnimeModule.removeSubgroupRule(this.id);
      },
   },
});
</script>

<style lang="scss" scoped>
.action-buttons {
   margin-top: 14%;
}

.action-icon {
   padding-left: 10px;
}

.v-dialog--fullscreen {
   .action-icon {
      width: 50%;
   }
}
</style>
