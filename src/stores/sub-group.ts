import { acceptHMRUpdate, defineStore } from 'pinia';

import { CreateSubGroupDTO } from '~/types/sub-group/dto/CreateSubGroupDTO';
import { UpdateSubGroupDTO } from '~/types/sub-group/dto/UpdateSubGroupDTO';
import { SubGroup } from '~/types/sub-group/sub-group.model';
import { service as SubgroupService } from '../services/sub-group.service';

export const useSubGroup = defineStore('subgroup', () => {
   const subgroups = ref({} as { [seriesId: number]: SubGroup[] });

   async function createSubGroup(createModel: CreateSubGroupDTO) {
      const group = await SubgroupService.create(createModel);

      subgroups.value = { ...subgroups.value, [createModel.seriesId]: (subgroups.value?.[createModel.seriesId] ?? []).concat(group) };
   }

   async function updateSubGroup(updateModel: UpdateSubGroupDTO) {
      const updatedGroup = await SubgroupService.update(updateModel);

      const currentItems = subgroups?.[updatedGroup.series.id] ?? [updatedGroup];

      subgroups.value = { ...subgroups, [updatedGroup.series.id]: currentItems.map((group) => (group.id === updatedGroup.id ? updatedGroup : group)) };
   }

   async function removeSubGroup(subGroupId: number) {
      await SubgroupService.remove(subGroupId);

      subgroups.value = Object.entries(subgroups).reduce((acc, [seriesId, groups]) => {
         return { ...acc, [seriesId]: groups.filter((group) => group.id !== subGroupId) };
      }, {} as { [key: number]: SubGroup[] });
   }

   return { createSubGroup, updateSubGroup, removeSubGroup };
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSubGroup, import.meta.hot));
