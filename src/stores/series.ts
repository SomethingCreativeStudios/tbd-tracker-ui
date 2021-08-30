import { acceptHMRUpdate, defineStore } from 'pinia';
import { UpdateSeriesDTO } from '~/types/season/dto/UpdateSeriesDTO';
import { Series } from '~/types/series/series.model';
import { service as SeriesService } from '~/services/series.service';
import { CreateBySeasonDTO } from '~/types/season/dto/CreateBySeasonDTO';
import { useSettingStore } from '~/stores/setting';
import { SortBy } from '~/types/series/sort-by.enum';

export const useSeriesStore = defineStore('series', () => {
   const series = ref([] as Series[]);
   const syncingSeries = ref({} as { [id: number]: boolean });

   async function setSeries(betterSeries: Series[]) {
      series.value = betterSeries;
   }

   async function addSeries(newSeries: Series[]) {
      series.value = series.value.concat(newSeries);
   }

   async function removeShow(idToRemove: number) {
      await SeriesService.remove(idToRemove);

      series.value = series.value.filter(({ id }) => idToRemove !== id);
   }

   async function updateShow(updateModel: UpdateSeriesDTO) {
      const show = await SeriesService.update(updateModel);

      series.value = series.value.map((currentShow) => (currentShow.id === show.id ? show : currentShow));
   }

   async function refreshShow(id: number) {
      const show = await SeriesService.fetchById(id);

      series.value = series.value.map((currentShow) => (currentShow.id === show.id ? show : currentShow));
   }

   async function syncWithMAL(id: number) {
      const show = await SeriesService.syncWithMal(id);
      const imageUrl = await SeriesService.syncImageUrl(id);

      series.value = series.value.map((currentShow) => (currentShow.id === show.id ? { ...show, imageUrl } : currentShow));
   }

   async function createBySeason(createModel: CreateBySeasonDTO) {
      addSeries(await SeriesService.createSeason(createModel));
   }

   function updateSyncStatus(id: number, isSyncing: boolean) {
      syncingSeries.value = { ...syncingSeries.value, [id]: isSyncing };
   }

   async function toggleWatchStatus(id: number) {
      const newWatchStatus = await SeriesService.updateWatchStatus(id);
      series.value = series.value.map((currentShow) => (currentShow.id === id ? { ...currentShow, watchStatus: newWatchStatus } : currentShow));
   }

   async function refreshSeries() {
      const { currentSeason, currentYear } = useSettingStore();
      const foundSeries = await SeriesService.fetchAll({ season: currentSeason, year: currentYear, sortBy: SortBy.QUEUE });
      console.log(foundSeries);
      setSeries(foundSeries);
   }

   return { setSeries, addSeries, updateShow, syncWithMAL, removeShow, createBySeason, toggleWatchStatus, updateSyncStatus, refreshShow, refreshSeries };
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSeriesStore, import.meta.hot));
