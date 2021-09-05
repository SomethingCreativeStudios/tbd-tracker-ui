import { reactive, computed } from 'vue';
import { SidebarType } from '~/types/sidebar/sidebar.enum';

const state = reactive({ type: SidebarType.NONE, params: {} as any });

//@ts-ignore
window.state.sidebar = state;

function setType(type: SidebarType, params?: any) {
  state.type = type;
  state.params = params;
}

export function useSidebar() {
  return { setType, currentType: computed(() => state.type), params: computed(() => state.params) };
}
