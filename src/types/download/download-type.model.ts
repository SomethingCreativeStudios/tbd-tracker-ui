export interface DownloadItem {
   speed: number;
   totalDownloaded: number;
   progress: number;
   name: string;
   hash: string;
   timeLeft: string;
   isDone: boolean;
   queued: boolean;
   id: number;
}
