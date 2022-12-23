import { reactive, computed } from 'vue';

import { service as AuthService } from '~/services/auth.service';
import { service as SeriesService } from '~/services/series.service';
import { service as NyaaService } from '~/services/nyaa.service';
import { service as QueryService } from '~/services/query.service';
import { service as SettingService } from '~/services/setting.service';
import { service as SubGroupRuleService } from '~/services/sub-group-rule.service';
import { service as SubGroupService } from '~/services/sub-group.service';
import { service as MalService } from '~/services/mal.service';
import { service as TorrentService } from '~/services/torrent.service';
import { useSeries, useSetting, useSubgroup, useSubgroupRule } from '~/composables';

const state = reactive({ isLoading: true });

//@ts-ignore
window.state.global = state;

async function refreshAuthToken() {
  await AuthService.refreshToken();
  console.log('Auth Connected');
  await SeriesService.refreshToken();
  console.log('Series Connected');
  await NyaaService.refreshToken();
  console.log('Nyaa Connected');
  await QueryService.refreshToken();
  console.log('Query Connected');
  await SettingService.refreshToken();
  console.log('Setting Connected');
  await SubGroupRuleService.refreshToken();
  console.log('Rule Connected');
  await SubGroupService.refreshToken();
  console.log('Sub Connected');
  await MalService.refreshToken();
  console.log('Mal Connected');
  await TorrentService.refreshToken();
  console.log('Torrent Connected');
}

async function setUpStores() {
  console.log('Loading Stores');
  state.isLoading = true;

  const { setUp: setUpSeries } = useSeries();
  const { setUp: setUpSetting } = useSetting();
  const { setUp: setUpSubgroup } = useSubgroup();
  const { setUp: setUpSubgroupRule } = useSubgroupRule();

  await setUpSetting();
  await setUpSeries();
  await setUpSubgroup();
  await setUpSubgroupRule();

  state.isLoading = false;
}

async function reload() {
  await refreshAuthToken();
  await setUpStores();
}

function isLoading() {
  return computed(() => state.isLoading);
}

export function useGlobal() {
  return { reload, refreshAuthToken, setUpStores, isLoading };
}
