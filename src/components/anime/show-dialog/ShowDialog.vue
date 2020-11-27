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
               Anime <v-icon color="#E5A00D" @click="onSync">fas fa-sync {{ isSyncing ? 'fa-spin' : '' }}</v-icon>
            </span>
         </v-card-title>
         <v-card-text>
            <v-container>
               <v-row class="item-list">
                  <template v-for="item in queue">
                     <v-list-item :key="item.downloadLink" @click="onItem(item)">
                        <v-list-item-content>
                           <v-list-item-title>{{ item.itemName }}</v-list-item-title>
                        </v-list-item-content>
                     </v-list-item>
                  </template>
               </v-row>
            </v-container>
         </v-card-text>
         <v-card-actions v-if="$vuetify.breakpoint.mobile">
            <v-btn class="action-btn" color="green" @click="onConfirm">Done</v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script>
import { downloadShow } from '~/compositions/series/series';
import { syncShow } from '@/compositions/series/series';

export default {
   name: 'show-dialog',
   props: {
      seriesId: {
         type: Number,
         default: 0,
      },
      queue: {
         type: Array,
         default: () => [],
      },
      isSyncing: {
         type: Boolean,
         default: false,
      },
   },
   data() {
      return {
         dialog: false,
      };
   },
   computed: {
      dialogTransition() {
         return this.$vuetify.breakpoint.mobile ? 'dialog-bottom-transition' : '';
      },
   },
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
      onItem({ downloadLink }) {
         // window.open(downloadLink, '_blank');

         downloadShow(downloadLink, this.seriesId);
      },

      onSync() {
         syncShow(this.seriesId);
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

.item-list {
   height: 210px;
   overflow-y: scroll;
}

.v-list-item {
   height: 43px;
}

.action-btn {
   width: 100%;
}

@media only screen and (max-width: 600px) {
   .item-list ::v-deep {
      height: 65px;
      overflow: visible;

      .v-list-item__title {
         font-size: 13px;
      }
   }
}
</style>
