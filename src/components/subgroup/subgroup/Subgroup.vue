<template>
   <v-card class="subgroup">
      <v-card-title class="headline">
         {{ name }}
         <v-icon class="action-icon" @click="onSave">fas fa-save</v-icon>
         <confirm-dialog @confirm="onDelete">
            <template #activator="{ on }">
               <v-icon class="action-icon" v-on="on">fas fa-trash</v-icon>
            </template>
            <template #message> Do you really want to delete subgroup: {{ name }}? </template>
         </confirm-dialog>
      </v-card-title>
      <v-card-text>
         <v-row>
            <v-col cols="12" sm="6">
               <v-combobox label="Subgroup Name" :items="subgroupNames" :value="name" @change="onChange('name', $event)"></v-combobox>
            </v-col>
            <v-col cols="12" sm="6">
               <v-select
                  label="Prefered Resultion"
                  :value="preferedResultion"
                  :items="resultions"
                  @change="onChange('preferedResultion', $event)"
                  item-text="text"
                  item-value="value"
               ></v-select>
            </v-col>
            <v-col cols="12">
               <v-row>
                  <span class="title rules-title">Rules <v-icon small @click="onRuleAdd">fas fa-plus</v-icon></span>
                  <template v-for="rule in rules">
                     <v-col cols="12" :key="rule.id">
                        <subgroup-rule v-bind="rule" :showId="showId" :subgroupId="id"></subgroup-rule>
                        <v-divider></v-divider>
                     </v-col>
                  </template>
               </v-row>
            </v-col>
         </v-row>
      </v-card-text>
   </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { ConfirmDialog } from '~/components/dialogs';
import { AnimeModule } from '~/store/modules/anime';
import { SettingsModule } from '~/store/modules/settings';
import SubgroupRule from '../subgroup-rule';

export default Vue.extend({
   name: 'subgroup',
   components: { SubgroupRule, ConfirmDialog },
   props: {
      id: {
         type: Number,
         default: 0,
      },
      showId: {
         type: Number,
         default: 0,
      },
      name: {
         type: String,
         default: '',
      },
      preferedResultion: {
         type: String,
         default: '',
      },
      rules: {
         type: Array,
         default: () => [],
      },
   },
   data() {
      return {
         updatedSubgroup: {},
         resultions: [
            { text: '720p', value: '720' },
            { text: '1080p', value: '1080' },
            { text: '480p', value: '480' },
         ],
      };
   },
   computed: {
      subgroupNames() {
         return AnimeModule.subgroupNames.concat(SettingsModule.defaultSubgroup);
      },
   },
   methods: {
      onChange(field, value) {
         this.updatedSubgroup = { ...this.updatedSubgroup, [field]: value };
      },

      onRuleAdd() {
         AnimeModule.addSubgroupRule({ id: this.showId, subgroupId: this.id });
      },

      onDelete() {
         AnimeModule.removeSubgroup({ id: this.showId, subgroupId: this.id });
      },

      onSave() {
         AnimeModule.updateSubgroup({ id: this.showId, subgroupId: this.id, newGroup: this.updatedSubgroup });
      },
   },
});
</script>

<style lang="scss" scoped>
.rules-title {
   padding-left: 14px;
}

.action-icon {
   padding-left: 10px;
}
</style>
