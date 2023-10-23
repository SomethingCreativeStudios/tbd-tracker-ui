<template>
  <div class="downloads">
    <div class="row row_body">
      <div class="row_body--add">
        <q-input style="flex: 4" filled v-model="magUrl" label="URL/MAG" />
        <q-btn style="flex: 5" color="primary" text-color="white" :label="'Pick Location (' + downloadLocation + ')'" @click="onLocation()" />
        <q-btn style="flex: 1" color="primary" text-color="white" label="+ Add" @click="onAddDownload()" />
      </div>
      <div class="row_body--body">
        <template v-for="item in downloads" :key="item.downloadLink">
          <q-item v-ripple>
            <q-item-section>
              <q-item-label>{{ item.name }} - {{ item.timeLeft }}</q-item-label>
              <q-item-label caption>
                <q-linear-progress size="25px" :value="item.progress" color="accent">
                  <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="black" :label="`${Math.ceil(item.progress * 100)}% (${getDownloadSpeed(item.speed)})`" />
                  </div>
                </q-linear-progress>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-for="item in queued" :key="item.downloadLink">
          <q-item v-ripple>
            <q-item-section>
              <q-item-label>{{ item.fileName }}</q-item-label>
              <q-item-label caption>
                <q-linear-progress size="25px" :value="0" color="accent">
                  <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="black" label="QUEUED" />
                  </div>
                </q-linear-progress>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </div>
    </div>

    <q-fab color="secondary" class="floating-button" icon="keyboard_arrow_up" direction="up">
      <q-fab-action color="secondary" @click="onTest" label="test" icon="fas fa-vial" />
    </q-fab>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDownload, useSidebar } from '~/composables';
import { useQuasar } from 'quasar';
import { service as TorrentService } from '~/services/torrent.service';
import { SidebarType } from '~/types/sidebar/sidebar.enum';
import { MediaType } from '~/types/movie/movie.models';

const { getDownloads, getQueued } = useDownload();
const { setType } = useSidebar();

export default defineComponent({
  name: 'page-download',
  setup() {
    const { screen } = useQuasar();

    return {
      magUrl: ref(''),
      downloadLocation: ref('/'),
      downloads: getDownloads,
      queued: getQueued,
      height: `${screen.height - 123}px`,
    };
  },
  methods: {
    onTest() {
      TorrentService.testDownload();
    },
    onLocation() {
      setType(SidebarType.FILE_DIALOG, { basePath: this.downloadLocation }, (value) => {
        console.log(value);
        this.downloadLocation = value;
      });
    },
    onAddDownload() {
      TorrentService.addDownload(this.magUrl, MediaType.TV_SHOW, this.downloadLocation);
    },
    getDownloadSpeed(speed: number) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (speed == 0) return 'n/a';
      const i = parseInt(`${Math.floor(Math.log(speed) / Math.log(1024))}`);
      if (i == 0) return `${speed} ${sizes[i]}`;
      return (speed / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    },
  },
});
</script>

<style scoped lang="scss">
.downloads {
  height: v-bind(height);
}
.floating-button {
  position: fixed;
  bottom: 10px;
  right: 10px;
}

.row_body {
  position: relative;
  overflow: auto;
  height: 100%;
}

.row_body--body {
  width: 100%;
  position: absolute;

  padding-top: 103px;
  pointer-events: none;
}

.row_body--add {
  display: flex;
  height: min-content;
  width: 100%;
  column-gap: 10px;

  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
