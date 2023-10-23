<template>
  <q-card class="movie-card" flat bordered>
    <q-card-section class="movie-card__body" horizontal>
      <q-img v-if="imagePath" :src="imagePath" loading="lazy">
        <div class="movie-card__title absolute-bottom text-subtitle2 text-center">
          {{ displayName }}
        </div>
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-negative text-white">RIP Image</div>
          <div class="movie-card__title absolute-bottom text-subtitle2 text-center">
            {{ displayName }}
          </div>
        </template>
      </q-img>
      <q-img v-else>
        <div class="absolute-full flex flex-center bg-negative text-white">No Image</div>
        <div class="movie-card__title absolute-bottom text-subtitle2 text-center">
          {{ displayName }}
        </div>
      </q-img>
      <q-card-section>
        <q-badge class="movie-card__sync movie-card__sync--badge" rounded :color="resColor" :label="parsedResolution" />

        <div class="movie-card__title movie-card__title--sub text-subtitle2 text-center">
          {{ name }}
        </div>
        <div class="movie-card__description">
          {{ description }}
        </div>

        <q-card-actions class="no-wrap">
          <q-btn flat color="secondary" @click="onMeta()">Find Meta</q-btn>
          <q-btn flat color="secondary" @click="onDownload()">Download</q-btn>
        </q-card-actions>
      </q-card-section>
    </q-card-section>
    <q-linear-progress v-if="downloadItem" class="movie-card__progress q-mt-md" :value="downloadItem" />
  </q-card>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useMovies, useDownload } from '~/composables';
import { service as MovieService } from '~/services/movie.service';
import { service as TorrentService } from '~/services/torrent.service';
import { MediaType } from '~/types/movie/movie.models';

const { setMeta } = useMovies();
const { downloadByName } = useDownload();

export default defineComponent({
  name: 'movie-card',
  props: {
    name: {
      type: String,
      default: '',
    },
    parsedName: {
      type: String,
      default: '',
    },
    parsedResolution: {
      type: String,
      default: 'NOT_FOUND',
    },
    link: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    alternativeCount: {
      type: Number,
      default: 0,
    },
    displayName: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
    },

    imagePath: {
      type: String,
      default: '',
    },

    releaseDate: {
      type: Date,
      default: new Date(),
    },
  },
  setup(props) {
    return {
      downloadItem: computed(() => {
        const downloadItem = downloadByName(props.name);
        return downloadItem.value?.progress;
      }),
      resColor: computed(() => {
        if (props.parsedResolution === '1080') return 'primary';
        if (props.parsedResolution === '720') return 'yellow';
        if (props.parsedResolution === '480') return 'orange';

        return 'red';
      }),
    };
  },
  methods: {
    async onMeta() {
      const items = await MovieService.findMeta(this.parsedName as string);

      setMeta(this.link as string, items);
    },
    onDownload() {
      TorrentService.addDownload(this.link as string, MediaType.MOVIE, '');
    },
  },
});
</script>

<style scoped lang="scss">
.movie-card {
  height: 265px;
  line-height: 1;
}

.movie-card__sync:hover {
  cursor: pointer;
}

.movie-card__sync {
  color: #f7b40e;
  position: absolute;
  right: 7px;
  top: 7px;

  text-shadow: 2px 2px rgb(0 0 0 / 75%);
}

.movie-card__sync--badge {
  color: white;
}

.movie-card__body {
  width: 100%;
  height: 100%;

  display: inline-grid;
  grid-template-columns: 185px auto;

  position: initial;
}

.movie-card__title {
  line-height: 1;
}

.movie-card__title--sub {
  padding-top: 20px;
  word-break: break-word;
}

.movie-card__title:hover {
  cursor: pointer;
}

.movie-card__description {
  margin-top: 10px;

  line-height: 1.2;
  overflow: hidden;
  height: 97px;
}

.movie-card__progress {
  position: absolute;
  bottom: 0;
}

.has-tags .movie-card__description {
  height: 84px;
}

.movie-card__description:hover {
  overflow: auto;
}

.q-card__actions {
  position: absolute;
  bottom: 0;
  left: -4px;
}

@media (max-width: $breakpoint-xs-max) {
  .movie-card {
    min-height: 265px;
    height: 650px;
  }

  .movie-card__body {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 420px auto;
  }
}
</style>
