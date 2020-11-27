// initial state
import { VuexModule, Module, getModule, MutationAction } from 'vuex-module-decorators';

import store from '~/store';
import { SeasonName } from '@/models/season';

@Module({ namespaced: true, name: 'settings', dynamic: true, store })
class SettingsModule extends VuexModule {
   public currentYear: number = 2020;
   public currentSeason: SeasonName = SeasonName.FALL;
   public defaultSubgroup: string = '';

   @MutationAction({ mutate: ['currentYear'] })
   public async setCurrentYear(year: number) {
      return { currentYear: year };
   }

   @MutationAction({ mutate: ['currentSeason'] })
   public async setCurrentSeason(season: SeasonName) {
      return { currentSeason: season };
   }

   @MutationAction({ mutate: ['defaultSubgroup'] })
   public async setDefaultSubgroup(subgroup: string) {
      return { defaultSubgroup: subgroup };
   }
}

export default getModule(SettingsModule);
