import { useSettingStore } from './stores/setting';
import { useSeriesStore } from './stores/series';

export async function bootstrap() {
   await loadSettings();
}

async function loadSettings() {
   const settingStore = useSettingStore();
   const seriesStore = useSeriesStore();

   await settingStore.refreshSettings();
   await seriesStore.refreshSeries();
}
