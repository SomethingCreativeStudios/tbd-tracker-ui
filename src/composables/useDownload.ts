import { reactive, computed, readonly } from 'vue';
import { DownloadItem } from '~/types/download/download-type.model';
import { DownloadingModel } from '~/types/download/downloading.model';
import { StartDownload } from '~/types/download/start-download.model';
const state = reactive({
  downloads: {} as { [hash: string]: DownloadItem },
  queue: [] as { fileName: string; url: string }[],
});

//@ts-ignore
window.state.downloads = state;

function exists(hash: string) {
  return computed(() => state.downloads[hash] !== undefined);
}

function removeFromQueue(url: string) {
  state.queue = state.queue.filter((item) => item.url !== url);
}

function addToQueue(fileName: string, url: string) {
  state.queue = state.queue.concat({ fileName, url });
}

function triggerDownload(newDownload: StartDownload) {
  removeFromQueue(newDownload.value.url);

  state.downloads = {
    ...state.downloads,
    [newDownload.hash]: {
      hash: newDownload.hash,
      isDone: false,
      name: newDownload.value.name,
      id: +newDownload.value.id,
      progress: 0,
      speed: 0,
      timeLeft: '',
      totalDownloaded: 0,
      queued: false,
    },
  };
}

function updateDownload({ hash, value }: DownloadingModel) {
  state.downloads = {
    ...state.downloads,
    [hash]: {
      ...state.downloads[hash],
      name: value.name,
      totalDownloaded: value.totalDownloaded,
      progress: value.progress,
      speed: value.speed,
      timeLeft: value.timeLeft,
      id: +value.id,
    },
  };
}

function completeDownload(hash: string) {
  state.downloads = Object.entries(state.downloads).reduce((acc, [hashC, value]) => (hash !== hashC ? { ...acc, [hashC]: value } : acc), {});
}

function downloadById(id: number) {
  return computed(() => Object.values(state.downloads).find((download) => download.id === id));
}

export function useDownload() {
  return {
    exists,
    removeFromQueue,
    addToQueue,
    triggerDownload,
    updateDownload,
    completeDownload,
    downloadById,
    getDownloads: computed(() => readonly(state.downloads)),
    getQueued: computed(() => readonly(state.queue)),
  };
}
