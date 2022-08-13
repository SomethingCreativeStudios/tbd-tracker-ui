import { reactive, computed } from 'vue';
import { service as SeriesService } from '~/services/series.service';
import { service as SettingService } from '~/services/setting.service';
import { Settings } from '~/types/settings/setting.model';
import { SeasonName } from '~/types/season/season-name.enum';
import { SettingType } from '~/types/settings/setting-type.enum';

const state = reactive({
  currentYear: 2020,
  currentSeason: SeasonName.FALL,
  defaultSubgroup: '',
  folderNames: [] as string[],
});

//@ts-ignore
window.state.series = state;

function setFolderNames(folderNames: string[]) {
  state.folderNames = folderNames;
}

function setSettings(settings: Settings[]) {
  const currentYear = settings.find(({ key }) => key === 'currentYear')?.value;
  const currentSeason = settings.find(({ key }) => key === 'currentSeason')?.value;
  const defaultSubgroup = settings.find(({ key }) => key === 'defaultSubgroup')?.value;

  if (currentYear) {
    state.currentYear = Number(currentYear);
  }

  if (currentSeason) {
    state.currentSeason = currentSeason as SeasonName;
  }

  if (defaultSubgroup) {
    state.defaultSubgroup = defaultSubgroup;
  }
}

async function setCurrentYear(year: number) {
  await SettingService.setSettings({
    key: 'currentYear',
    value: year as any,
    type: SettingType.NUMBER,
  });

  state.currentYear = year;
}

async function setCurrentSeason(name: SeasonName) {
  await SettingService.setSettings({
    key: 'currentSeason',
    value: name as any,
    type: SettingType.STRING,
  });

  state.currentSeason = name;
}

async function setDefaultSubgroup(groupName: string) {
  await SettingService.setSettings({
    key: 'defaultSubgroup',
    value: groupName,
    type: SettingType.STRING,
  });

  state.defaultSubgroup = groupName;
}

function buildIO(route: string) {
  const port = process.env.VUE_APP_WEBSOCKET_PORT;
  const path = window.location.hostname;
  const baseHasPort = !!window.location.port;

  console.log('port', window.location.port, port, window.location.port);

  return `${path}${baseHasPort ? `:${port}` : ''}` + route;
}
async function setUp() {
  setSettings(await SettingService.fetchSettings());
  setFolderNames(await SeriesService.getFolderNames());
}

export function useSetting() {
  return {
    setUp,
    buildIO,
    setCurrentYear,
    setCurrentSeason,
    setDefaultSubgroup,
    getCurrentYear: computed(() => state.currentYear),
    getFolderNames: computed(() => state.folderNames),
    getDefaultSubgroup: computed(() => state.defaultSubgroup),
    getCurrentSeason: computed(() => state.currentSeason),
  };
}
