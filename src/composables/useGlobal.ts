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
import { service as MovieService } from '~/services/movie.service';
import { useSeries, useSetting, useSubgroup, useSubgroupRule } from '~/composables';

const state = reactive({ isLoading: true });

//@ts-ignore
window.state.global = state;

async function refreshAuthToken() {
  const isValid = await AuthService.validateToken(localStorage.getItem('accessToken'));

  if (!isValid) {
    // @ts-ignore
    const router = window.router as Router;
    localStorage.removeItem('accessToken');

    router.push({ path: 'login' });
    return;
  }

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
  await MovieService.refreshToken();
  console.log('Movie Connected');
}

async function setUpStores() {
  console.log('Loading Stores');
  state.isLoading = true;

  const { setUp: setUpSeries } = useSeries();
  const { setUp: setUpSetting } = useSetting();
  const { setUp: setUpSubgroup } = useSubgroup();
  const { setUp: setUpSubgroupRule } = useSubgroupRule();

  await setUpSetting();
  console.log('Loaded Settings');
  await setUpSeries();
  console.log('Loaded Series');
  await setUpSubgroup();
  console.log('Loaded Subgroups');
  await setUpSubgroupRule();
  console.log('Loaded Subgroup Rules');

  state.isLoading = false;
  console.log('Loaded Stores');
}

async function reload() {
  await refreshAuthToken();

  if (localStorage.getItem('accessToken')) {
    await setUpStores();
  }
}

function isLoading() {
  return computed(() => state.isLoading);
}

export function useGlobal() {
  return { reload, refreshAuthToken, setUpStores, isLoading };
}
