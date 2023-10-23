import { reactive, readonly, computed } from 'vue';
import { Season } from '~/types/season/season.model';

const state = reactive({
  seasons: [] as Season[],
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
window.state.season = state;

function setSeasons(seasons: Season[]) {
  state.seasons = seasons;
}

function clearSeasons() {
  state.seasons = [];
}

async function setUp() {}

export function useSeason() {
  return {
    setUp,
    setSeasons,
    clearSeasons,
    getSeasons: computed(() => readonly(state.seasons)),
  };
}
