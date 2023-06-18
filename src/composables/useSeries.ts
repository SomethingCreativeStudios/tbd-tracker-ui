import { reactive, readonly, computed } from 'vue';
import { Series } from '~/types/series/series.model';
import { service as SeriesService } from '~/services/series.service';
import { UpdateSeriesDTO } from '~/types/season/dto/UpdateSeriesDTO';
import { CreateBySeasonDTO } from '~/types/season/dto/CreateBySeasonDTO';
import { SortBy } from '~/types/series/sort-by.enum';
import { useSetting } from './useSettings';
import { useSubgroup } from './useSubgroup';
import { SubGroup } from '~/types/sub-group/sub-group.model';
import { NyaaItem } from '~/types/nyaa/nyaa-item.model';

const { getCurrentSeason, getCurrentYear } = useSetting();
const state = reactive({
  series: [] as Series[],
  syncingSeries: {} as { [id: number]: boolean },
  ignoreLinks: [] as string[],
});

//@ts-ignore
window.state.series = state;

function setSeries(series: Series[]) {
  state.series = series.map((series) => ({
    ...series,
    showQueue: series.showQueue.map((queue) => ({ ...queue, isIgnored: state.ignoreLinks.includes(queue.downloadLink) })),
  }));
}

function setIgnoreLinks(links: string[]) {
  state.ignoreLinks = links;
}

async function removeShow(id: number) {
  await SeriesService.remove(id);

  state.series = state.series.filter(({ id: seriesId }) => id !== seriesId);
}

async function updateShow(updateModel: UpdateSeriesDTO) {
  const show = await SeriesService.update(updateModel);

  state.series = state.series.map((currentShow) => (currentShow.id === show.id ? show : currentShow));
}

async function refreshShow(id: number) {
  const show = await SeriesService.fetchById(id);

  state.series = state.series.map((currentShow) => (currentShow.id === show.id ? show : currentShow));
}

async function syncWithMal(id: number) {
  const show = await SeriesService.syncWithMal(id);
  const imageUrl = await SeriesService.syncImageUrl(id);

  state.series = state.series.map((currentShow) => (currentShow.id === show.id ? { ...show, imageUrl } : currentShow));
}

async function createBySeason(createModel: CreateBySeasonDTO) {
  await SeriesService.createSeason(createModel);
}

function updateSyncStatus(id: number, isSyncing: boolean) {
  state.syncingSeries = { ...state.syncingSeries, [id]: isSyncing };
}

function updatePendingStatus(id: number, isPending: boolean) {
  state.syncingSeries = { ...state.syncingSeries, [id]: false };
  state.series = state.series.map((currentShow) => (currentShow.id === id ? { ...currentShow, hasSubgroupsPending: isPending } : currentShow));
}

async function toggleWatchStatus(id: number) {
  const newWatchStatus = await SeriesService.updateWatchStatus(id);

  state.series = state.series.map((currentShow) => (currentShow.id === id ? { ...currentShow, watchStatus: newWatchStatus } : currentShow));
}

function getFilteredQueue(id: number, showIgnored = false) {
  const { getSubgroups } = useSubgroup();

  return computed(() => {
    const groups = getSubgroups.value[id];
    const foundSeries = state.series.find((series) => series.id === id);

    const filtered = foundSeries.showQueue.filter((queue) => meetsSubgroup(queue as NyaaItem, groups as SubGroup[]));

    return showIgnored ? filtered : filtered.filter((queue) => !queue.isIgnored);
  });
}

function isSyncing(id: number) {
  return computed(() => state.syncingSeries[id]);
}

function toggleIgnored(id: number, link: string) {
  state.series = state.series.map((series) =>
    series.id === id
      ? {
          ...series,
          showQueue: series.showQueue.map((queue) => (queue.downloadLink === link ? { ...queue, isIgnored: !queue.isIgnored } : queue)),
        }
      : series
  );
}

function getUntaggedSeries() {
  return computed(() => state.series.filter((series) => series.tags.length === 0));
}

function getTaggedSeries() {
  return computed(() => state.series.filter((series) => series.tags.length > 0));
}

async function setUp(ignoreLinks: string[]) {
  const foundSeries = await SeriesService.fetchAll({
    season: getCurrentSeason.value,
    year: getCurrentYear.value,
    sortBy: SortBy.QUEUE,
  });

  const leftOvers = await SeriesService.findLeftOvers({
    season: getCurrentSeason.value,
    year: getCurrentYear.value,
    sortBy: SortBy.QUEUE,
  });

  setIgnoreLinks(ignoreLinks);
  setSeries([...leftOvers, ...foundSeries]);
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
    updatePendingStatus,
    toggleWatchStatus,
    getFilteredQueue,
    getUntaggedSeries,
    getTaggedSeries,
    setUp,
    toggleIgnored,
    getSyncing: computed(() => readonly(state.syncingSeries)),
    getSeries: computed(() => readonly(state.series)),
    getIgnoreLinks: computed(() => readonly(state.ignoreLinks)),
  };
}

function meetsSubgroup(queueItem: NyaaItem, groups: SubGroup[]) {
  if (queueItem.itemName.toLocaleLowerCase().includes('[batch]')) {
    return;
  }

  const foundGroup = groups?.find((group) => (group.name = queueItem.subGroupName));
  if (!foundGroup) {
    return false;
  }

  return foundGroup.preferedResultion === queueItem.resolution;
}
