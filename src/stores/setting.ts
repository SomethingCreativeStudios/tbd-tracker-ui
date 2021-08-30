import { acceptHMRUpdate, defineStore } from 'pinia';
import { SeasonName } from '~/types/season/season-name.enum';
import { Settings } from '~/types/settings/setting.model';
import { service as SettingService } from '~/services/setting.service';
import { service as SeriesSetting } from '~/services/series.service';

export const useSettingStore = defineStore('setting', () => {
   const currentYear = ref(2020);
   const currentSeason = ref(SeasonName.FALL);
   const defaultSubgroup = ref('');
   const folderNames = ref([] as string[]);

   function setCurrentYear(year: number) {
      currentYear.value = year;
   }

   function setCurrentSeason(name: SeasonName) {
      currentSeason.value = name;
   }

   function setDefaultSubgroup(groupName: string) {
      defaultSubgroup.value = groupName;
   }

   function setFolderNames(newFolderNames: string[]) {
      folderNames.value = newFolderNames;
   }

   function setSettings(settings: Settings[]) {
      const currentYear = settings.find(({ key }) => key === 'currentYear')?.value;
      const currentSeason = settings.find(({ key }) => key === 'currentSeason')?.value;
      const defaultSubgroup = settings.find(({ key }) => key === 'defaultSubgroup')?.value;

      if (currentYear) {
         setCurrentYear(Number(currentYear));
      }

      if (currentSeason) {
         setCurrentSeason(currentSeason as SeasonName);
      }

      if (defaultSubgroup) {
         setDefaultSubgroup(defaultSubgroup);
      }
   }

   async function refreshSettings() {
      setSettings(await SettingService.fetchSettings());
      setFolderNames(await SeriesSetting.getFolderNames());
   }

   return {
      setCurrentYear,
      setCurrentSeason,
      setDefaultSubgroup,
      setSettings,
      refreshSettings,
      defaultSubgroup: computed(() => defaultSubgroup.value),
      folderNames: computed(() => folderNames.value),
      currentSeason: computed(() => currentSeason.value),
      currentYear: computed(() => currentYear.value),
   };
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot));
