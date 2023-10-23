<template>
  <div class="settings q-pa-md">
    <div class="action__section">
      <q-btn label="Save Settings" color="primary" text-color="white" @click="onUpdate" />
    </div>
    <div class="settings__section row q-col-gutter-lg">
      <q-input class="col-12 col-md-12" label="Approved Subgroups" color="secondary" v-model="approvedSubgroups" dense />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useSetting } from '~/composables';

export default defineComponent({
  name: 'page-settings',
  components: {},
  setup() {
    const { getApprovedSubgroups } = useSetting();

    const approvedSubgroups = ref(getApprovedSubgroups.value);
    return { approvedSubgroups };
  },
  methods: {
    onUpdate() {
      const { setApprovedSubgroups } = useSetting();

      setApprovedSubgroups(this.approvedSubgroups);
    },
  },
});
</script>

<style scoped lang="scss">
.settings {
  margin: 20px;
}

.settings__section {
  column-gap: 20px;
}

.action__section {
  display: flex;
  width: 100%;

  .q-btn {
    width: 100%;
  }
}
</style>
