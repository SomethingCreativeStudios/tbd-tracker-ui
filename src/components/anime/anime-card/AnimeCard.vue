<template>
   <v-card class="anime-card" elevation="6" :style="cardStyles" :class="cardClasses">
      <div v-if="selectMode === 'multi' || deleted" class="card-overlay" @click="onBodyClick"></div>
      <div class="card-body">
         <show-dialog :queue="showQueue" :seriesId="id" :isSyncing="isSyncing" v-if="showQueue.length">
            <template #activator="{ on, attrs }">
               <span v-bind="attrs" v-on="on" style="z-index:3">
                  <v-badge class="card-badge" :content="showQueue.length"> </v-badge>
               </span>
            </template>
         </show-dialog>
         <div v-else class="sync-badge">
            <v-icon small color="#E5A00D" @click="onSync">fas fa-sync {{ isSyncing ? 'fa-spin' : '' }}</v-icon>
         </div>
         <div class="multi-dot">
            <v-icon small color="#E5A00D" @click="onSelect">{{ !selected ? 'far fa-dot-circle' : 'fas fa-circle' }}</v-icon>
         </div>
         <img :src="imageUrl" lazy />
         <v-layout column class="card-action">
            <v-list-item class="v-list-item--five-line" three-line>
               <v-list-item-content>
                  <div class="overline mb-4">
                     <span class="dot" @click="onStatusUpdate"></span> {{ watchStatus | status }} ({{ downloaded }}/{{ numberOfEpisodes }})
                  </div>
                  <v-list-item-title class="headline mb-1">
                     {{ name }}
                     <div class="chips">
                        <template v-for="tag in tags">
                           <v-chip :key="tag" x-small color="primary">{{ tag }}</v-chip>
                        </template>
                     </div>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                     {{ description }}
                  </v-list-item-subtitle>
               </v-list-item-content>
            </v-list-item>
            <v-spacer></v-spacer>
            <v-layout class="card-action__buttons">
               <v-spacer></v-spacer>
               <anime-dialog :id="id">
                  <template #activator="{ on, attrs }">
                     <v-btn color="green" text v-bind="attrs" v-on="on">
                        Edit
                     </v-btn>
                  </template>
               </anime-dialog>
               <subgroup-dialog :id="id">
                  <template #activator="{ on, attrs }">
                     <v-btn color="green" text v-bind="attrs" v-on="on">
                        Subgroups
                     </v-btn>
                  </template>
               </subgroup-dialog>
               <confirm-dialog @confirm="onDelete">
                  <template #activator="{ on, attrs }">
                     <v-btn color="red" text v-bind="attrs" v-on="on">
                        Delete
                     </v-btn>
                  </template>
                  <template #message> Do you really want to stop tracking {{ name }}? </template>
               </confirm-dialog>
            </v-layout>
         </v-layout>
      </div>
   </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { WatchingStatus } from '@/models/anime';
import { ConfirmDialog } from '~dialogs';
import { SubgroupDialog } from '~/components/subgroup';
import { AnimeModule } from '~modules/anime';
import AnimeDialog from '../anime-dialog';
import ShowDialog from '../show-dialog/ShowDialog.vue';
import { service as NyaaService } from '~/websockets/nyaaService';

export default {
   name: 'anime-card',
   components: { ConfirmDialog, SubgroupDialog, AnimeDialog, ShowDialog },
   props: {
      id: {
         type: Number,
         default: 0,
      },
      name: {
         type: String,
         default: '',
      },
      otherNames: {
         type: Array,
         default: () => [],
      },
      genres: {
         type: Array,
         default: () => [],
      },
      tags: {
         type: Array,
         default: () => [],
      },
      watchStatus: {
         type: String,
         default: WatchingStatus.NOT_WATCHING,
      },
      continuing: {
         type: Boolean,
         default: false,
      },
      imageUrl: {
         type: String,
         default: '',
      },
      description: {
         type: String,
         default: '',
      },
      airingData: {
         type: Date,
         default: new Date(),
      },
      downloaded: {
         type: Number,
         default: '',
      },
      numberOfEpisodes: {
         type: Number,
         default: '',
      },
      score: {
         type: Number,
         default: 0,
      },
      subgroups: {
         type: Array,
         default: () => [],
      },
      showQueue: {
         type: Array,
         default: () => [],
      },
      isSyncing: {
         type: Boolean,
         default: false,
      },
   },
   computed: {
      ...mapState({
         selected({ anime }) {
            return anime.selectedShows.includes(this.id);
         },

         selectMode: ({ anime }) => anime.selectMode,
      }),
      cardStyles() {
         let watchColor = '';
         if (this.watchStatus === WatchingStatus.WATCHING) {
            watchColor = '#00ff00';
         }

         if (this.watchStatus === WatchingStatus.WATCHED) {
            watchColor = '#4a86e8';
         }

         if (this.watchStatus === WatchingStatus.THREE_RULE) {
            watchColor = '#ff9900';
         }

         if (this.watchStatus === WatchingStatus.NOT_WATCHING) {
            watchColor = '#ff0000';
         }

         return { '--AnimeCard--watch-status': watchColor, '--AnimeCard--line-clamp': this.tags.length > 0 ? 3 : 5 };
      },
      cardClasses() {
         return {
            [`select-mode--${this.selectMode}`]: true,
            'is-selected': this.selected,
            'is-deleted': this.deleted,
         };
      },
   },
   data() {
      return {
         deleted: false,
      };
   },
   methods: {
      onDelete() {
         this.deleted = true;
         this.$emit('delete');
      },
      onSelect() {
         this.$emit('select', ~this.selected);
      },
      onBodyClick() {
         if (this.selectMode === 'single') return;

         this.$emit('select', !this.selected);
      },
      onSync() {
         NyaaService.syncShow(this.id);
      },
      onStatusUpdate() {
         AnimeModule.updateWatchStatus(this.id);
      },
   },
   filters: {
      status: function(value) {
         if (value === WatchingStatus.WATCHING) {
            return 'Watching';
         }

         if (value === WatchingStatus.WATCHED) {
            return 'Watched';
         }

         if (value === WatchingStatus.THREE_RULE) {
            return 'Three Episode Rule';
         }

         if (value === WatchingStatus.NOT_WATCHING) {
            return 'Not Watching';
         }
      },
   },
};
</script>

<style lang="scss" scoped>
.card-body {
   display: flex;
   height: 342px;
   position: relative;
}

.card-badge:hover {
   cursor: pointer;
}

.multi-dot {
   position: absolute;
   top: -2px;
   left: 3px;
   z-index: 6;

   .v-icon {
      text-shadow: 1px 2px rgb(8 8 8 / 75%);
   }
}

.card-overlay {
   width: 100%;
   height: 100%;

   position: absolute;

   z-index: 100;
}

.is-deleted {
   .card-overlay {
      background: radial-gradient(farthest-corner at 50% 50%, rgba(50, 50, 50, 0.5) 111%, #323232 100%);

      img {
         opacity: 0.2;
      }
   }
}

.select-mode--multi {
   .multi-dot {
      pointer-events: none;
   }

   .card-overlay:hover {
      cursor: pointer;
      background: radial-gradient(farthest-corner at 50% 50%, rgba(50, 50, 50, 0.5) 111%, #323232 100%);

      img {
         opacity: 0.2;
      }
   }
}

.is-selected .card-overlay {
   background: radial-gradient(farthest-corner at 50% 50%, rgba(50, 50, 50, 0.5) 111%, #323232 100%);
}

.multi-dot:hover {
   cursor: pointer;
}

@media only screen and (max-width: 600px) {
   .card-body {
      display: flex;
      flex-wrap: wrap;
      height: 647px;
   }

   img {
      width: 100%;
      height: 420px;
   }
}

.v-list-item--five-line ::v-deep .v-list-item__subtitle {
   -webkit-line-clamp: var(--AnimeCard--line-clamp, 5);
}

.v-list-item__subtitle:hover {
   overflow-y: auto;
   -webkit-line-clamp: initial;
   max-height: 82px;
}

.dot:hover {
   cursor: pointer;
}

.dot {
   height: 12px;
   width: 12px;
   background-color: var(--AnimeCard--watch-status);
   border-radius: 50%;
   display: inline-block;
}

.card-badge {
   position: absolute;
   top: 21px;
   right: 25px;
}

.sync-badge {
   position: absolute;
   top: 1px;
   right: 9px;

   z-index: 6;

   .v-icon {
      text-shadow: 1px 2px rgb(8 8 8 / 75%);
   }
}
</style>
