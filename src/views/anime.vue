<template>
   <div class="anime">
      <anime-collection></anime-collection>
   </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { AnimeCollection } from '~/components/anime';

export default Vue.extend({
   name: 'anime',
   components: { AnimeCollection },
   setup() {},
});
</script>
