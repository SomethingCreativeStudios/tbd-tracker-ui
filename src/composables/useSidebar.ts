import { reactive, computed } from 'vue';
import { SidebarType } from '~/types/sidebar/sidebar.enum';

const state = reactive({ type: SidebarType.NONE, params: {} });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
window.state.sidebar = state;

function setType(type: SidebarType, params?: unknown, returnValue?: (item) => void) {
  state.type = type;
  state.params = { ...(params as object || {}), returnValue };
}

export function useSidebar() {
  return { setType, currentType: computed(() => state.type), params: computed(() => state.params) };
}
