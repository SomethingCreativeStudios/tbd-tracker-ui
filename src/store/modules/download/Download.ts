// initial state
import Vue from 'vue';
import { DownloadItem } from '@/models/downloadItem';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';

import store from '~/store';

@Module({ namespaced: true, name: 'download', dynamic: true, store })
class DownloadModule extends VuexModule {
   public items: DownloadItem[] = [];

   @Mutation
   private mutateUpdateName({ hash, name }: { hash: string; name: string }) {
      if (!this.items.some(item => item.hash === hash)) {
         Vue.set(
            this,
            'items',
            this.items.concat({ hash, name, isDone: false, progress: 0, queued: true, timeLeft: '', speed: 0, totalDownloaded: 0 })
         );
      }

      Vue.set(
         this,
         'items',
         this.items.map(item => {
            return item.hash === hash ? { ...item, name } : item;
         })
      );
   }

   @Mutation
   private mutateUpdateProgress(progressModel: {
      hash: string;
      name: string;
      progress: number;
      timeLeft: string;
      speed: number;
      totalDownloaded: number;
   }) {
      if (!this.items.some(item => item.hash === progressModel.hash)) {
         Vue.set(
            this,
            'items',
            this.items.concat({
               hash: progressModel.hash,
               name: progressModel.name,
               timeLeft: progressModel.timeLeft,
               isDone: false,
               progress: 0,
               speed: 0,
               totalDownloaded: 0,
               queued: false,
            })
         );
      }

      Vue.set(
         this,
         'items',
         this.items.map(item => {
            return item.hash === progressModel.hash
               ? {
                    ...item,
                    name: progressModel.name,
                    progress: progressModel.progress,
                    totalDownloaded: progressModel.totalDownloaded,
                    speed: progressModel.speed,
                    timeLeft: progressModel.timeLeft,
                    queued: false,
                 }
               : item;
         })
      );
   }

   @Mutation
   private mutateRemoveItem(hash: string) {
      Vue.set(
         this,
         'items',
         this.items.filter(item => item.hash !== hash)
      );
   }

   @Mutation
   private mutateAddItem({ hash, url, name }: { hash: string; name?: string; url?: string }) {
      if (url) {
         Vue.set(
            this,
            'items',
            this.items.map(item => (item.hash === url ? { ...item, hash, queued: true } : item))
         );
      } else {
         Vue.set(
            this,
            'items',
            this.items.concat({ hash, isDone: false, name: name || 'loading', timeLeft: '', progress: 0, queued: true, speed: 0, totalDownloaded: 0 })
         );
      }
   }

   @Action
   public async updateName(nameModel: { hash: string; name: string }) {
      this.context.commit('mutateUpdateName', nameModel);
   }

   @Action
   public async updateProgress(progressModel: {
      hash: string;
      name: string;
      progress: number;
      timeLeft: string;
      speed: number;
      totalDownloaded: number;
   }) {
      this.context.commit('mutateUpdateProgress', progressModel);
   }

   @Action
   public async removeItem(hash: string) {
      this.context.commit('mutateRemoveItem', hash);
   }

   @Action
   public async addItem({ hash, url, queued }: { hash: string; url: string; queued?: boolean }) {
      if (queued) {
         this.context.commit('mutateAddItem', { hash, url });
      } else {
         this.context.commit('mutateAddItem', { hash });
      }
   }

   @Action
   public async addQueuedItem({ url, name }: { url: string; name: string }) {
      this.context.commit('mutateAddItem', { hash: url, name });
   }
}

export default getModule(DownloadModule);
