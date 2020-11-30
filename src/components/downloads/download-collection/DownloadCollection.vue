<template>
   <div class="download-collection">
      <template v-for="activeDownload in activeDownloads">
         <download-item :key="activeDownload.name" v-bind="activeDownload"></download-item>
      </template>
   </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { DownloadModule } from '~modules/download';

import DownloadItem from '../download-item';

export default Vue.extend({
   name: 'download-collection',
   components: { DownloadItem },
   props: {},
   data() {
      return {};
   },
   computed: {
      activeDownloads() {
         return DownloadModule.items;
      },
   },
   methods: {},
});
</script>

<style lang="scss" scoped>
.download-collection {
   display: flex;
   flex-direction: column;
   padding: 20px;

   overflow-y: scroll;
   height: 94vh;
}

.download-item {
   margin-bottom: 10px;
}
</style>
