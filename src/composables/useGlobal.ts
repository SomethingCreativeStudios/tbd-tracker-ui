import { service as AuthService } from '~/services/auth.service';
import { service as SeriesService } from '~/services/series.service';
import { service as NyaaService } from '~/services/nyaa.service';
import { service as QueryService } from '~/services/query.service';
import { service as SettingService } from '~/services/setting.service';
import { service as SubGroupRuleService } from '~/services/sub-group-rule.service';
import { service as SubGroupService } from '~/services/sub-group.service';
import { service as MalService } from '~/services/mal.service';
import { useSeries, useSetting, useSubgroup, useSubgroupRule } from '~/composables';

function refreshAuthToken() {
    AuthService.refreshToken();
    SeriesService.refreshToken();
    NyaaService.refreshToken();
    QueryService.refreshToken();
    SettingService.refreshToken();
    SubGroupRuleService.refreshToken();
    SubGroupService.refreshToken();
    MalService.refreshToken();
}

async function setUpStores() {
    const { setUp: setUpSeries } = useSeries();
    const { setUp: setUpSetting } = useSetting();
    const { setUp: setUpSubgroup } = useSubgroup();
    const { setUp: setUpSubgroupRule } = useSubgroupRule();

    await setUpSetting();
    await setUpSeries();
    await setUpSubgroup();
    await setUpSubgroupRule();
}

async function reload() {
    refreshAuthToken();
    await setUpStores();
}

export function useGlobal() {
    return { reload, refreshAuthToken, setUpStores }
}