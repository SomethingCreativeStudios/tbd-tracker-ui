import { reactive, readonly, computed } from 'vue';

const state = reactive({
  selectedShows: [] as number[],
  selectMode: 'single' as 'single' | 'many',
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
window.state.query = state;

function setSelectedShows(ids: number[]) {
  state.selectedShows = ids;
}

function clearSelected() {
  state.selectMode = 'single';
  state.selectedShows = [];
}

function toggleSelectMode() {
  state.selectMode = state.selectMode === 'single' ? 'many' : 'single';
}

export function useQuery() {
  return {
    setSelectedShows,
    clearSelected,
    toggleSelectMode,
    getSelected: computed(() => readonly(state.selectedShows)),
    getSelectMode: computed(() => state.selectMode),
  };
}
