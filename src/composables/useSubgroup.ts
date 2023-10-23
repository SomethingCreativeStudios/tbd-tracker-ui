import { reactive, readonly, computed } from 'vue';
import { service as SubgroupService } from '../services/sub-group.service';
import { useSeries } from './useSeries';
import { CreateSubGroupDTO } from '~/types/sub-group/dto/CreateSubGroupDTO';
import { SubGroup } from '~/types/sub-group/sub-group.model';
import { UpdateSubGroupDTO } from '~/types/sub-group/dto/UpdateSubGroupDTO';

const { getSeries } = useSeries();
const state = reactive({
  subgroups: {} as { [seriesId: number]: SubGroup[] }
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
window.state.subgroup = state;

async function createSubgroup(createModel: CreateSubGroupDTO) {
  const group = await SubgroupService.create(createModel);

  state.subgroups = {
    ...state.subgroups,
    [createModel.seriesId]: (state.subgroups?.[createModel.seriesId] ?? []).concat(group)
  };

  return group;
}

async function updateSubgroup(updateModel: UpdateSubGroupDTO) {
  const updatedGroup = await SubgroupService.update(updateModel);

  const currentItems = state.subgroups?.[updatedGroup.series.id] ?? [updatedGroup];

  state.subgroups = {
    ...state.subgroups,
    [updatedGroup.series.id]: currentItems.map((group: SubGroup) => (group.id === updatedGroup.id ? updatedGroup : group))
  };

  return updatedGroup;
}

async function removeSubgroup(subgroupId: number) {
  await SubgroupService.remove(subgroupId);

  state.subgroups = Object.entries(state.subgroups).reduce((acc, [seriesId, groups]) => {
    return {
      ...acc,
      [seriesId]: groups.filter(group => group.id !== subgroupId)
    };
  }, {} as { [key: number]: SubGroup[] });
}

async function setUp() {
  state.subgroups = {};

  for await (const show of getSeries.value) {
    state.subgroups[show.id] = await SubgroupService.findBySeries(show.id);
  }
}

export function useSubgroup() {
  return {
    setUp,
    createSubgroup,
    updateSubgroup,
    removeSubgroup,
    getSubgroups: computed(() => readonly(state.subgroups))
  };
}
