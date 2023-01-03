import { reactive, computed } from 'vue';
import { MediaCollection, MediaItem } from '~/types/movie/movie.models';

const state = reactive({
  results: [] as MediaCollection[],
});

//@ts-ignore
window.state.movies = state;

function setLink(mediaIndex: number, link: number) {
  state.results = state.results.map((result, index) => (index === mediaIndex ? { ...result, selectedItem: link } : result));
}

function setMeta(link: string, items: MediaItem[]) {
  state.results = state.results.map((result) => (result.link === link ? { ...result, items } : result));
}

export function useMovies() {
  return {
    setLink,
    setMeta,
    getResults: () => computed(() => state.results),
    setResults: (results: MediaCollection[]) => (state.results = results),
  };
}
