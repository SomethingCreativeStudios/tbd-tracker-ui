<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="/icons/favicon.png" />
          </q-avatar>
          TBD Tracker
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/shows" label="Shows" />
        <q-route-tab to="/western-shows" label="Western Shows" />
        <q-route-tab to="/movies" label="Movies" />
        <q-route-tab to="/downloads" label="Downloads" />
      </q-tabs>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered overlay :width="sideBarWidth" behavior="mobile">
      <sidebar-series v-if="sideBarType === 1" v-bind="params"></sidebar-series>
      <sidebar-subgroup v-if="sideBarType === 2" v-bind="params"></sidebar-subgroup>
      <sidebar-show-queue v-if="sideBarType === 3" v-bind="params"></sidebar-show-queue>
      <sidebar-search-series v-if="sideBarType === 4" v-bind="params"></sidebar-search-series>
      <sidebar-search-season v-if="sideBarType === 5" v-bind="params"></sidebar-search-season>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, watch } from 'vue';
import { useSidebar } from '~/composables';
import { useQuasar } from 'quasar';
import { SidebarType } from '~/types/sidebar/sidebar.enum';
import { SidebarSeries, SidebarSubgroup, SidebarShowQueue, SidebarSearchSeries, SidebarSearchSeason } from '~/components/sidebar';

export default {
  components: { SidebarSeries, SidebarSubgroup, SidebarShowQueue, SidebarSearchSeries, SidebarSearchSeason },
  setup() {
    const { currentType, params, setType } = useSidebar();
    const { screen } = useQuasar();
    const rightDrawerOpen = ref(false);

    watch(currentType, () => (rightDrawerOpen.value = currentType.value !== SidebarType.NONE));
    watch(rightDrawerOpen, () => {
      if (!rightDrawerOpen.value) {
        setType(SidebarType.NONE);
      }
    });

    return {
      params,
      sideBarWidth: screen.width < 650 ? 300 : 600,
      rightDrawerOpen,
      sideBarType: currentType,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      }
    };
  },
  methods: {
    onClose() {
      console.log('test');
    }
  }
};
</script>

<style scoped>
.q-avatar {
  font-size: 75px;
}
</style>
