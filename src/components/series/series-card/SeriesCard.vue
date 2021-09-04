<template>
  <q-card class="series-card" flat bordered>
    <q-card-section class="series-card__body" horizontal>
      <q-img src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx120697-72Sf22C9PTQn.jpg">
        <div class="absolute-bottom text-subtitle2 text-center">
          {{ title }}
        </div>
      </q-img>
      <q-card-section>
        <q-icon class="series-card__sync" name="sync" />
        <div class="series-card__info text-h6">Have {{ currentEp }} out {{ total }}</div>
        <div class="series-card__info text-h8">Next: {{ nextAiring }}</div>
        <div class="row series-card__tags" v-if="tags.length > 0">
          <template v-for="tag in tags" :key="tag">
            <q-badge rounded color="secondary" :label="tag" />
          </template>
        </div>

        <div class="series-card__description">
          {{ description }}
          {{ description }}
          {{ description }}
          {{ description }}
        </div>

        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'series-card',
  props: {
    title: {
      type: String,
      default: 'That One Anime With That One Person'
    },
    tags: {
      type: Array as PropType<string[]>,
      default: () => ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6']
    },
    currentEp: {
      type: String,
      default: '9'
    },
    total: {
      type: String,
      default: '12'
    },
    nextAiring: {
      type: String,
      default: '10 hours, 12 mins'
    },
    description: {
      type: String,
      default:
        'That One Anime With That One Person. Featuring that one thing that the one person does. The one person is trying to live a normal adjective life. However in That One Anime, that other person appears'
    }
  }
});
</script>

<style scoped lang="scss">
.series-card {
  min-height: 265px;
  line-height: 1;
}

.series-card__sync {
  position: absolute;
  right: 5px;
  top: 5px;
}

.series-card__body {
  display: inline-grid;
  grid-template-columns: 185px auto;
}

.series-card__title {
  line-height: 1;
}

.series-card__description {
  margin-top: 10px;

  line-height: 1.2;
  overflow: hidden;
  height: 97px;
}

.series-card__description:hover {
  overflow: auto;
}

.series-card__tags {
  padding-top: 10px;

  column-gap: 10px;
  row-gap: 10px;
}

@media (max-width: $breakpoint-xs-max) {
  .series-card__body {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 420px auto;
  }
}
</style>
