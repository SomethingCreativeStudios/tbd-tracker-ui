<template>
  <div class="downloads">
    <div class="row row_body">
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
import { defineComponent } from 'vue';
import { useDownload } from '~/composables';
import { useQuasar } from 'quasar';
import { service as NyaaService } from '~/services/nyaa.service';

const { getDownloads, getQueued } = useDownload();

export default defineComponent({
  name: 'download',
  setup() {
    const { screen } = useQuasar();
    return { downloads: getDownloads, queued: getQueued, height: `${screen.height - 123}px` };
  },
  methods: {
    onTest() {
      NyaaService.testDownload();
    },
    getDownloadSpeed(speed: number) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (speed == 0) return 'n/a';
      const i = parseInt(`${Math.floor(Math.log(speed) / Math.log(1024))}`);
      if (i == 0) return `${speed} ${sizes[i]}`;
      return (speed / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    }
  }
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
}
</style>
