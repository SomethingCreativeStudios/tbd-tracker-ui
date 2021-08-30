export interface DownloadingModel {
   hash: string;
   value: {
      name: string;
      justDownloaded: number;
      totalDownloaded: number;
      speed: number;
      progress: number;
      timeLeft: string;
      ratio: number;
   };
}
