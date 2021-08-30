import { acceptHMRUpdate, defineStore } from 'pinia';
import { Season } from '~/types/season/season.model';

export const useSeasonStore = defineStore('season', () => {
   const seasons = ref([] as Season[]);

   function setSeasons(betterSeasons: Season[]) {
      seasons.value = betterSeasons;
   }

   function clearSeasons() {
      seasons.value = [];
   }

   return { setSeasons, clearSeasons };
});


if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSeasonStore, import.meta.hot));
