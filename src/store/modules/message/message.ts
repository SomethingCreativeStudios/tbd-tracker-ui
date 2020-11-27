// initial state
import vuetify from '@/plugins/vuetify';
import Vue from 'vue';
import { VuexModule, Module, Mutation, Action, getModule, MutationAction } from 'vuex-module-decorators';

import store from '~/store';

@Module({ namespaced: true, name: 'message', dynamic: true, store })
class MessageModule extends VuexModule {
   public message: string = '';
   public showMessage: boolean = false;

   @Mutation
   private mutateShowMessage(showMessage: boolean) {
      Vue.set(this, 'showMessage', showMessage);
   }

   @MutationAction({ mutate: ['message', 'showMessage'] })
   public async setMessage(message: string) {
      return { message, showMessage: true };
   }

   @MutationAction({ mutate: ['showMessage'] })
   public async setShowMessage(showMessage: boolean) {
      return { showMessage };
   }
}

export default getModule(MessageModule);
