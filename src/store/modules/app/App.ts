// initial state
import { VuexModule, Module, Mutation, Action, getModule, MutationAction } from 'vuex-module-decorators';

import store from '~/store';

@Module({ namespaced: true, name: 'app', dynamic: true, store })
class AppModule extends VuexModule {
   public view: string = '';

   @MutationAction({ mutate: ['view'] })
   public async setView(view: string) {
      return { view };
   }
}

export default getModule(AppModule);
