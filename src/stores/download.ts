import { acceptHMRUpdate, defineStore } from 'pinia';
import { DownloadItem } from '~/types/download/download-type.model';
import { DownloadingModel } from '~/types/download/downloading.model';
import { StartDownload } from '~/types/download/start-download.model';

export const useDownloadStore = defineStore('download', () => {
   const downloads = ref({} as { [hash: string]: DownloadItem });
   const queue = ref([] as { fileName: string; url: string }[]);

   function exists(hash: string) {
      return downloads.value[hash] !== undefined;
   }

   function removeFromQueue(url: string) {
      queue.value = queue.value.filter((item) => item.url !== url);
   }

   function addQueue(fileName: string, url: string) {
      queue.value = queue.value.concat({ fileName, url });
   }

   function triggerDownload(newDownload: StartDownload) {
      removeFromQueue(newDownload.value.url);
      downloads.value = {
         ...downloads.value,
         [newDownload.hash]: { hash: newDownload.hash, isDone: false, name: newDownload.value.name, progress: 0, speed: 0, timeLeft: '', totalDownloaded: 0, queued: false },
      };
   }

   function updateDownload({ hash, value }: DownloadingModel) {
      downloads.value = {
         ...downloads.value,
         [hash]: { ...downloads.value[hash], name: value.name, totalDownloaded: value.totalDownloaded, progress: value.progress, speed: value.speed, timeLeft: value.timeLeft },
      };
   }

   function completeDownload(hash: string) {
      downloads.value = Object.entries(downloads.value).reduce((acc, [hashC, value]) => (hash !== hashC ? { ...acc, [hashC]: value } : acc), {});
   }

   return { addQueue, triggerDownload, updateDownload, completeDownload };
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useDownloadStore, import.meta.hot));
