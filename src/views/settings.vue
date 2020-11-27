<template>
   <v-row class="season-body">
      <v-col cols="12" md="6">
         <v-select label="Season" :items="seasons" item-value="value" item-text="label" :value="currentSeason" @change="onSeasonSelect"></v-select>
      </v-col>
      <v-col cols="12" md="6">
         <v-select label="Year" :items="years" :value="currentYear" @change="onYearSelect"></v-select>
      </v-col>
   </v-row>
</template>

<script>
import { SettingsModule } from '~modules/settings';
import { setSetting } from '~/compositions/settings';
import { SeasonName } from '@/models/season';

export default {
   name: 'settings',
   computed: {
      currentSeason() {
         return SettingsModule.currentSeason;
      },
      currentYear() {
         return String(SettingsModule.currentYear);
      },
      seasons() {
         return [
            { label: 'Winter', value: SeasonName.WINTER },
            { label: 'Spring', value: SeasonName.SPRING },
            { label: 'Summer', value: SeasonName.SUMMER },
            { label: 'Fall', value: SeasonName.FALL },
         ];
      },

      years() {
         return ['2020', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
      },
   },
   methods: {
      async onSeasonSelect(newSeason) {
         const setting = await setSetting('currentSeason', newSeason);
         SettingsModule.setCurrentSeason(setting.value);
      },
      async onYearSelect(newYear) {
         const setting = await setSetting('currentYear', Number(newYear));
         SettingsModule.setCurrentYear(setting.value);
      },
   },
};
</script>

<style lang="scss" scoped>
.season-body,
.search-body {
   padding: 20px;
}
</style>
