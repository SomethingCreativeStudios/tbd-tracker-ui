import { acceptHMRUpdate, defineStore } from 'pinia';

export const useQueryStore = defineStore('query', () => {
   const selectedShows = ref([] as number[]);
   const selectMode = ref('single' as 'single' | 'many');

   function setSelectedShows(ids: number[]) {
      selectedShows.value = ids;
   }

   function clearSelected() {
      selectedShows.value = [];
      selectMode.value = 'single';
   }

   function toggleSelectMode() {
      selectMode.value = selectMode.value === 'single' ? 'many' : 'single';
   }

   return { setSelectedShows, clearSelected, toggleSelectMode };
});


if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useQueryStore, import.meta.hot));
