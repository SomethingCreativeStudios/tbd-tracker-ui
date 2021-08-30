export interface StartDownload {
   hash: string;
   value: {
      name: string;
      url: string;
      queued: boolean;
   };
}
