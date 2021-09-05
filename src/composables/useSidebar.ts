import { reactive, computed } from 'vue';
import { SidebarType } from '~/types/sidebar/sidebar.enum';

const state = reactive({ type: SidebarType.NONE });

//@ts-ignore
window.state.sidebar = state;

function setType(type: SidebarType) {
  state.type = type;
}

export function useSidebar() {
  return { setType, currentType: computed(() => state.type) };
}
