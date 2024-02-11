<template>
  <q-card class="series-card" flat bordered :class="mainClass">
    <q-card-section class="series-card__body" horizontal>
      <q-img :src="imageUrl" loading="lazy">
        <div class="series-card__title absolute-bottom text-subtitle2 text-center" @click="onEdit">
          {{ title }}
        </div>
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-negative text-white">RIP Image</div>
          <div class="series-card__title absolute-bottom text-subtitle2 text-center" @click="onEdit">
            {{ title }}
          </div>
        </template>
      </q-img>
      <q-card-section>
        <q-icon v-if="watchStatus === 'watched' && isNaN(score) && score" :class="`series-card__score`" name="fas fa-plus" @click="onScore" />

        <q-badge
          v-if="watchStatus !== 'watched' && queueItems.length"
          class="series-card__sync series-card__sync--badge"
          rounded
          color="primiary"
          @click="onQueue"
          :label="queueItems.length"
        />
        <q-icon
          v-if="watchStatus !== 'watched' && !queueItems.length"
          :class="`series-card__sync ${currentEp === '0' ? 'series-card__sync--error' : ''} series-card__sync--${
            hasSubgroupsPending ? 'pending' : 'nothing'
          }`"
          :name="currentEp === '0' ? `fas fa-exclamation ${isSyncing ? 'fa-spin' : ''}` : `fas fa-sync ${isSyncing ? 'fa-spin' : ''}`"
          @click="onSync"
        />
        <div class="series-card__info text-h6">Have {{ currentEp }} out {{ total }}</div>
        <div class="series-card__info text-h8" v-if="watchStatus === 'watched' && !isNaN(score) && score">Score: {{ score }}</div>
        <div class="series-card__info text-h8" v-else>Next: {{ tillDate }}</div>
        <div class="row series-card__tags" v-if="tags.length > 0">
          <template v-for="tag in tags" :key="tag">
            <q-badge rounded color="secondary" :label="tag" />
          </template>
        </div>

        <div class="series-card__description">
          {{ description }}
        </div>

        <q-card-actions class="no-wrap">
          <q-btn flat color="secondary" @click="onSubgroup">Subgroups</q-btn>
          <q-btn flat color="negative" @click="onDelete">Delete</q-btn>
        </q-card-actions>
      </q-card-section>
    </q-card-section>
    <q-linear-progress v-if="downloadItem" class="series-card__progress q-mt-md" :value="downloadItem" />
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { getAiringTime } from '~/utils/time-helpers';

import { service as NyaaService } from '~/services/nyaa.service';
import { useSeries, useSidebar, useDownload } from '~/composables';
import { SidebarType } from '~/types/sidebar/sidebar.enum';
import { WatchingStatus } from '~/types/series/watching-status.enum';
import { NyaaItem } from '~/types/nyaa/nyaa-item.model';

const { isSyncing, getFilteredQueue, removeShow } = useSeries();
const { setType } = useSidebar();
const { downloadById } = useDownload();

export default defineComponent({
  name: 'series-card',
  props: {
    id: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'That One Anime With That One Person',
    },
    tags: {
      type: Array as PropType<string[]>,
      default: () => ['Tag 1', 'Tag 2'],
    },
    currentEp: {
      type: String,
      default: '9',
    },
    total: {
      type: String,
      default: '12',
    },
    airingData: {
      type: Date,
      default: new Date('2021-07-09'),
    },
    description: {
      type: String,
      default:
        'That One Anime With That One Person. Featuring that one thing that the one person does. The one person is trying to live an adjective life. However in That One Anime, that other person appears',
    },
    showsToDownload: {
      type: Number,
      default: 0,
    },
    nextAiringDate: {
      type: Date,
      default: new Date(),
    },
    hasSubgroupsPending: {
      type: Boolean,
      default: false,
    },
    malId: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    watchStatus: {
      type: String as PropType<WatchingStatus>,
      default: WatchingStatus.WATCHING,
    },

    showQueue: {
      type: Array as PropType<NyaaItem[]>,
      default: () => [],
    },
  },
  setup(props) {
    const queueItems = computed(() => {
      console.log(props.title, getFilteredQueue(props.id, false).value);
      return getFilteredQueue(props.id, false).value;
    });

    const mainClass = computed(() => ({
      'has-tags': props.tags.length > 0,
    }));

    return {
      queueItems,
      mainClass,
      isSyncing: isSyncing(props.id),
      tillDate: computed(() => getAiringTime(props.airingData, props.nextAiringDate)),
      downloadItem: computed(() => {
        const downloadItem = downloadById(props.id);
        return downloadItem.value?.progress;
      }),
    };
  },
  methods: {
    onSync() {
      if (!this.malId) {
        setType(SidebarType.SELECT_SHOW, { id: this.id });
        return;
      }

      console.log('1 2 and Sync');
      NyaaService.syncShow(this.id);
    },
    onEdit() {
      console.log('1 2 and Edit');
      setType(SidebarType.EDIT_SHOW, { id: this.id });
    },
    onSubgroup() {
      console.log('1 2 and Subgroup');
      setType(SidebarType.EDIT_SUBGROUP, { id: this.id });
    },
    onDelete() {
      console.log('1 2 and Delete');
      removeShow(this.id);
    },
    onQueue() {
      console.log('1 2 and Queue');
      setType(SidebarType.EDIT_QUEUE, { id: this.id });
    },
    onScore() {
      console.log('1 2 and Score');
      setType(SidebarType.EDIT_SHOW, { id: this.id });
    },
  },
});
</script>

<style scoped lang="scss">
.series-card {
  height: 265px;
  line-height: 1;
}

.series-card__score:hover,
.series-card__sync:hover {
  cursor: pointer;
}

.series-card__score,
.series-card__sync {
  color: #f7b40e;
  position: absolute;
  right: 7px;
  top: 7px;

  text-shadow: 2px 2px rgb(0 0 0 / 75%);
}

.series-card__score {
  color: green;
}

.series-card__sync--error {
  color: #d23601;
}

.series-card__sync--badge {
  color: white;
}

.series-card__sync--pending {
  color: green;
}

.series-card__body {
  width: 100%;
  height: 100%;

  display: inline-grid;
  grid-template-columns: 185px auto;

  position: initial;
}

.series-card__title {
  line-height: 1;
}

.series-card__title:hover {
  cursor: pointer;
}

.series-card__description {
  margin-top: 10px;

  line-height: 1.2;
  overflow: hidden;
  height: 97px;
}

.series-card__progress {
  position: absolute;
  bottom: 0;
}

.has-tags .series-card__description {
  height: 84px;
}

.series-card__description:hover {
  overflow: auto;
}

.series-card__tags {
  padding-top: 10px;

  column-gap: 10px;
  row-gap: 10px;
}

.q-card__actions {
  position: absolute;
  bottom: 0;
  left: -4px;
}

@media (max-width: $breakpoint-xs-max) {
  .series-card {
    min-height: 265px;
    height: 650px;
  }

  .series-card__body {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 420px auto;
  }
}
</style>
