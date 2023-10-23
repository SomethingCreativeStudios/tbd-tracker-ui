<template>
  <div class="sidebar-file-dialog">
    <div class="text-h6 title">Folder Picker</div>
    <div class="row row_body">
      <div class="row_body--body" :style="{ height: height }">
        <div class="row_body--items">
          <q-item clickable v-ripple @click="onGoUp()">Go Up ..</q-item>
          <template v-for="item in items" :key="item.fullPath">
            <q-item clickable v-ripple @click="onGoTo(item.fullPath)">{{ item.name }}</q-item>
          </template>
        </div>
      </div>
    </div>
    <div class="no-wrap sidebar-actions row">
      <q-btn class="col-6" flat color="secondary" @click="onFolderSelect">Select Folder</q-btn>
      <q-btn class="col-6" flat color="negative" @click="onCancel">Cancel</q-btn>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useSidebar } from '../../../composables';
import { SidebarType } from '../../../types/sidebar/sidebar.enum';
import { service as FileService } from '../../../services/file.service';

const { setType, params } = useSidebar();

export default defineComponent({
  name: 'sidebar-file-dialog',

  props: {
    basePath: {
      type: String,
      default: '/',
    },
  },

  setup(props) {
    const { screen } = useQuasar();
    const items = ref([] as { name: string; fullPath: string }[]);
    const currentDir = ref(props.basePath || '/');

    FileService.directoryGoTo(currentDir.value).then((found: any) => {
      items.value = found;
    });

    return { items, currentDir, height: `${screen.height - 123}px` };
  },

  methods: {
    onCancel() {
      setType(SidebarType.NONE);
    },

    async onGoUp() {
      this.currentDir = await FileService.getParentDir(this.currentDir);
      const items = await FileService.directoryUp(this.currentDir);

      this.items = items;
    },

    async onGoTo(path: string) {
      const items = await FileService.directoryGoTo(path);
      this.currentDir = path;
      this.items = items;
    },

    onFolderSelect() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      params.value.returnValue(this.currentDir);
      setType(SidebarType.NONE);
    },
  },
});
</script>

<style scoped>
.sidebar-file-dialog {
  margin: 10px;

  display: grid;
  grid-template-rows: min-content 1fr;
  grid-auto-flow: column;
  height: 90%;
}

.title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  padding-bottom: 20px;
}

.sidebar-actions {
  position: fixed;
  width: 100%;
  bottom: 0px;
}

.row_body--body {
  overflow: auto;
  width: 100%;
  height: 650px;
}

.row_body--items {
  width: 100%;
}
</style>
