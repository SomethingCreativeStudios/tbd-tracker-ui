<template>
   <v-dialog v-model="dialog" max-width="60%" scrollable :fullscreen="$vuetify.breakpoint.mobile" :transition="dialogTransition">
      <template #activator="{ on, attrs }">
         <slot name="activator" v-bind:attrs="attrs" v-bind:on="on">
            <v-btn v-bind="attrs" v-on="on">
               Open Dialog
            </v-btn>
         </slot>
      </template>
      <v-card>
         <v-card-title>
            <span class="headline">
               Subgroups <span><v-icon @click="onAdd">fas fa-plus</v-icon><v-icon class="search-icon" @click="onSearch">fas fa-search</v-icon></span>
            </span>
         </v-card-title>
         <v-card-text>
            <v-container>
               <template v-for="subgroup in suggestedGroups">
                  <v-col cols="12" :key="subgroup.name + subgroup.preferedResultion" @click="onSuggestSelected(subgroup)">
                     <v-row class="suggested-group">
                        <div class="suggested-group__name">{{ subgroup.name }} ({{ subgroup.preferedResultion }})</div>
                        <div class="suggested-group__term">{{ subgroup.rules[0].text }}</div>
                     </v-row>
                  </v-col>
               </template>
               <template v-for="subgroup in subgroups">
                  <v-col cols="12" :key="subgroup.id">
                     <subgroup v-bind="subgroup" :showId="id"></subgroup>
                  </v-col>
               </template>
            </v-container>
         </v-card-text>

         <v-card-actions v-if="$vuetify.breakpoint.mobile">
            <v-btn class="action-btn" color="green" @click="onConfirm">Done</v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script>
import { AnimeModule } from '~modules/anime';
import Subgroup from '../subgroup';
import { service as NyaaService } from '~/websockets/nyaaService';

export default {
   name: 'anime-dialog',
   components: { Subgroup },
   props: {
      id: {
         type: Number,
         default: 0,
      },
   },
   data() {
      return {
         dialog: false,
         suggestedGroups: [],
      };
   },
   computed: {
      subgroups() {
         return AnimeModule.show(this.id).subgroups;
      },
      dialogTransition() {
         return this.$vuetify.breakpoint.mobile ? 'dialog-bottom-transition' : '';
      },
   },
   watch: {},
   methods: {
      onCancel() {
         this.dialog = false;
         this.$emit('update:dialog', false);
         this.$emit('cancel');
      },
      onConfirm() {
         this.dialog = false;
         this.$emit('update:dialog', false);
         this.$emit('confirm');
      },

      onAdd() {
         AnimeModule.addSubgroup({ id: this.id, newGroup: new Subgroup() });
      },

      async onSearch() {
         const show = AnimeModule.shows.find(anime => anime.id === this.id);
         this.suggestedGroups = await NyaaService.suggestSubgroups(show.name, show.otherNames);
      },

      async onSuggestSelected(subgroup) {
         this.suggestedGroups = [];
         AnimeModule.addSubgroup({ id: this.id, default: subgroup });
      },
   },
};
</script>

<style lang="scss" scoped>
.v-input ::v-deep {
   input.v-input.input-186 {
      max-height: 62px;
      line-height: 26px;
   }
}

.action-btn {
   width: 100%;
}

.v-dialog--fullscreen {
   .v-card__text {
      padding: 0;
   }
}

.search-icon {
   padding-left: 10px;
}

.suggested-group:hover {
   background-color: lightgrey;
   cursor: pointer;
}

.suggested-group {
   font-size: 27px;
   min-height: 60px;
   padding: 14px;

   .suggested-group__term {
      padding-left: 20px;
   }
}
</style>
