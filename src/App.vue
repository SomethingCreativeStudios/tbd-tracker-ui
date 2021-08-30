<script lang="ts" setup>
import { useHead } from '@vueuse/head';
import { bootstrap } from '~/bootstrap';

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
   title: 'TBD-Tracker',
   meta: [{ name: 'description', content: 'Opinionated Vite Starter Template' }],
});

bootstrap();
</script>

<template>
   <router-view />
</template>
