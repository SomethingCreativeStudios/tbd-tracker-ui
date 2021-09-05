import { reactive, readonly, computed } from 'vue';
import { Series } from '~/types/series/series.model';
import { service as SeriesService } from '~/services/series.service';
import { UpdateSeriesDTO } from '~/types/season/dto/UpdateSeriesDTO';
import { CreateBySeasonDTO } from '~/types/season/dto/CreateBySeasonDTO';
import { SortBy } from '~/types/series/sort-by.enum';
import { useSetting } from './useSettings';

const { getCurrentSeason, getCurrentYear } = useSetting();
const state = reactive({
  series: [] as Series[],
  syncingSeries: {} as { [id: number]: boolean }
});

//@ts-ignore
window.state.series = state;

function setSeries(series: Series[]) {
  state.series = series;
}

function addSeries(newSeries: Series[]) {
  state.series = state.series.concat(newSeries);
}

async function removeShow(id: number) {
  await SeriesService.remove(id);

  state.series = state.series.filter(({ id: seriesId }) => id !== seriesId);
}

async function updateShow(updateModel: UpdateSeriesDTO) {
  const show = await SeriesService.update(updateModel);

  state.series = state.series.map(currentShow => (currentShow.id === show.id ? show : currentShow));
}

async function refreshShow(id: number) {
  const show = await SeriesService.fetchById(id);

  state.series = state.series.map(currentShow => (currentShow.id === show.id ? show : currentShow));
}

async function syncWithMal(id: number) {
  const show = await SeriesService.syncWithMal(id);
  const imageUrl = await SeriesService.syncImageUrl(id);

  state.series = state.series.map(currentShow => (currentShow.id === show.id ? { ...show, imageUrl } : currentShow));
}

async function createBySeason(createModel: CreateBySeasonDTO) {
  addSeries(await SeriesService.createSeason(createModel));
}

function updateSyncStatus(id: number, isSyncing: boolean) {
  state.syncingSeries = { ...state.syncingSeries, [id]: isSyncing };
}

async function toggleWatchStatus(id: number) {
  const newWatchStatus = await SeriesService.updateWatchStatus(id);

  state.series = state.series.map(currentShow => (currentShow.id === id ? { ...currentShow, watchStatus: newWatchStatus } : currentShow));
}

function isSyncing(id: number) {
  return computed(() => state.syncingSeries[id]);
}

async function setUp() {
  const foundSeries = await SeriesService.fetchAll({
    season: getCurrentSeason.value,
    year: getCurrentYear.value,
    sortBy: SortBy.QUEUE
  });

  console.log(foundSeries);

  setSeries(foundSeries);
}

export function useSeries() {
  return {
    isSyncing,
    removeShow,
    updateShow,
    refreshShow,
    syncWithMal,
    createBySeason,
    updateSyncStatus,
    toggleWatchStatus,
    setUp,
    getSyncing: computed(() => readonly(state.syncingSeries)),
    getSeries: computed(() => readonly(state.series))
  };
}
