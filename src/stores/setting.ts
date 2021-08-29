import { acceptHMRUpdate, defineStore } from 'pinia';
import { SeasonName } from '~/types/season/season-name.enum';

export const useSettingStore = defineStore('setting', () => {
   const currentYear = ref(2020);
   const currentSeason = ref(SeasonName.FALL);
   const defaultSubgroup = ref('');

   function setCurrentYear(year: number) {
      currentYear.value = year;
   }

   function setCurrentSeason(name: SeasonName) {
      currentSeason.value = name;
   }

   function setDefaultSubgroup(groupName: string) {
      defaultSubgroup.value = groupName;
   }

   return { setCurrentYear, setCurrentSeason, setDefaultSubgroup };
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot));
