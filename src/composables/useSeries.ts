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
import { isAfter } from 'date-fns';
import { uniq } from 'ramda';

const { getCurrentSeason, getCurrentYear } = useSetting();
const state = reactive({
  series: [] as Series[],
  syncingSeries: {} as { [id: number]: boolean },
  ignoreLinks: [] as string[],
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
window.state.series = state;

function setSeries(series: Series[]) {
  const filteredQueue = (items: NyaaItem[] = [], groups: SubGroup[] = []) =>
    items.filter((item) => {
      return groups.every((group) => group.preferedResultion === item.resolution) && !item.isIgnored;
    });

  const isFullyDownloaded = (series: Series) => series.downloaded != 0 && series.downloaded === series.numberOfEpisodes;

  const queuedSeries = series.filter((series) => series.subgroups?.length > 0 && filteredQueue(series.showQueue, series.subgroups).length > 0);

  const activeSeries = series.filter(
    (series) => !isFullyDownloaded(series) && series.subgroups?.length > 0 && filteredQueue(series.showQueue, series.subgroups).length === 0
  );
  const pendingSeries = series.filter((series) => series.subgroups?.length === 0);
  const finsihedSeries = series.filter((series) => isFullyDownloaded(series) && series.subgroups?.length > 0);

  const compareQueue = (a: Series, b: Series) => {
    if (a.downloaded === 0 && b.downloaded === 0) return 0;

    const aQueue = filteredQueue(a.showQueue, a.subgroups);
    const bQueue = filteredQueue(b.showQueue, b.subgroups);

    if (aQueue.length > bQueue.length) return -1;
    if (aQueue.length < bQueue.length) return 1;

    return 0;
  };

  const compareDate = (a: Series, b: Series) => {
    const nextAiringDateA = a.nextAiringDate;
    const nextAiringDateB = b.nextAiringDate;

    if (isAfter(nextAiringDateA, nextAiringDateB)) return -1;
    if (!isAfter(nextAiringDateA, nextAiringDateB)) return 1;

    return 0;
  };

  const sortedSeries = [...queuedSeries.sort(compareQueue), ...activeSeries.sort(compareDate), ...pendingSeries.sort(compareDate), ...finsihedSeries];

  state.series = sortedSeries.map((series) => ({
    ...series,
    showQueue: series.showQueue.map((queue) => ({ ...queue, isIgnored: state.ignoreLinks.includes(queue.downloadLink) })),
  }));
}

function setIgnoreLinks(links: string[]) {
  state.ignoreLinks = links;
}

async function removeShow(id: number) {
  await SeriesService.remove(id);

  setSeries(state.series.filter(({ id: seriesId }) => id !== seriesId));
}

async function updateShow(updateModel: UpdateSeriesDTO) {
  const show = await SeriesService.update(updateModel);

  setSeries(state.series.map((currentShow) => (currentShow.id === show.id ? { ...currentShow, ...show } : currentShow)));
}

async function refreshShow(id: number) {
  const show = await SeriesService.fetchById(id);
  const { setUp } = useSubgroup();

  const newSeries = state.series.map((currentShow) =>
    currentShow.id === show.id
      ? { ...show, showQueue: show.showQueue.map((queue) => ({ ...queue, isIgnored: state.ignoreLinks.includes(queue.downloadLink) })) }
      : currentShow
  );

  setSeries(newSeries);
  setUp();
}

async function syncWithMal(id: number) {
  const show = await SeriesService.syncWithMal(id);
  const imageUrl = await SeriesService.syncImageUrl(id);

  setSeries(state.series.map((currentShow) => (currentShow.id === show.id ? { ...currentShow, ...show, imageUrl } : currentShow)));
}

async function createBySeason(createModel: CreateBySeasonDTO) {
  await SeriesService.createSeason(createModel);
}

function updateSyncStatus(id: number, isSyncing: boolean) {
  state.syncingSeries = { ...state.syncingSeries, [id]: isSyncing };
}

function updatePendingStatus(id: number, isPending: boolean) {
  state.syncingSeries = { ...state.syncingSeries, [id]: false };
  setSeries(state.series.map((currentShow) => (currentShow.id === id ? { ...currentShow, hasSubgroupsPending: isPending } : currentShow)));
}

async function toggleWatchStatus(id: number) {
  const newWatchStatus = await SeriesService.updateWatchStatus(id);

  setSeries(state.series.map((currentShow) => (currentShow.id === id ? { ...currentShow, watchStatus: newWatchStatus } : currentShow)));
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

function getExistingTags() {
  return computed(() => uniq(state.series.flatMap((series) => series.tags)));
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
  setSeries([...foundSeries, ...leftOvers]);
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
    getExistingTags,
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
