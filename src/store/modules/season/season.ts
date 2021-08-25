// initial state
import Vue from 'vue';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';

import store from '~/store';
import { Season } from '@/models/season';
import { mergeDeepRight } from 'ramda';

@Module({ namespaced: true, name: 'season', dynamic: true, store })
class SeasonModule extends VuexModule {
   public seasons: Season[] = [];

   @Mutation
   private mutationSetSeasons(seasons: Season[]) {
      Vue.set(this, 'seasons', this.seasons.concat(seasons));
   }

   @Mutation
   private mutationUpdateSeason(season: Season) {
      const hasSeason = this.seasons.find(({ id }) => id === season.id);
      if (!hasSeason) {
         Vue.set(this, 'seasons', this.seasons.concat(season));
         return;
      }

      Vue.set(
         this,
         'seasons',
         this.seasons.map(oldSeason => (oldSeason.id === season.id ? mergeDeepRight(oldSeason, season) : oldSeason))
      );
   }

   @Mutation
   private mutationClearSeasons() {
      Vue.set(this, 'seasons', []);
   }

   @Action
   public async loadSeason() {
      this.context.commit('mutationSetSeasons', []);
   }

   @Action
   public async updateSeason(newSeason: Season) {
      this.context.commit('mutationUpdateSeason', newSeason);
   }
}

export default getModule(SeasonModule);
