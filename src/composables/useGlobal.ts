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
import { service as PlexService } from '~/services/plex.service';
import { useSeries, useSetting, useSubgroup, useSubgroupRule } from '~/composables';

const state = reactive({ isLoading: true });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
window.state.global = state;

async function refreshAuthToken() {
  const isValid = await AuthService.validateToken(localStorage.getItem('accessToken'));

  if (!isValid) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const router = window.router as Router;
    localStorage.removeItem('accessToken');

    router.push({ path: 'login' });
    return;
  }

  await AuthService.refreshToken();
  await SeriesService.refreshToken();
  await NyaaService.refreshToken();
  await QueryService.refreshToken();
  await SettingService.refreshToken();
  await SubGroupRuleService.refreshToken();
  await SubGroupService.refreshToken();
  await MalService.refreshToken();
  await TorrentService.refreshToken();
  await MovieService.refreshToken();
  await PlexService.refreshToken();
}

async function setUpStores() {
  console.log('Loading Stores');

  const { setUp: setUpSeries } = useSeries();
  const { setUp: setUpSetting } = useSetting();
  const { setUp: setUpSubgroup } = useSubgroup();
  const { setUp: setUpSubgroupRule } = useSubgroupRule();

  await setUpSetting();
  console.log('Loaded Settings');
  await setUpSeries(await NyaaService.fetchIgnoreLinks());
  console.log('Loaded Series');
  await setUpSubgroup();
  console.log('Loaded Subgroups');
  await setUpSubgroupRule();
  console.log('Loaded Subgroup Rules');

  console.log('Loaded Stores');
}

async function reload() {
  state.isLoading = true;
  await refreshAuthToken();

  if (localStorage.getItem('accessToken')) {
    await setUpStores();
  }

  state.isLoading = false;
}

function isLoading() {
  return computed(() => state.isLoading);
}

export function useGlobal() {
  return { reload, refreshAuthToken, setUpStores, isLoading };
}
