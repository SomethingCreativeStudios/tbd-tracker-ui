<template>
   <div class="anime-collection"></div>
</template>

<script>
export default {
   name: 'anime-collection',
   props: {
      series: {
         type: Array,
         default: () => [],
      },
   },
};
</script>

<style lang="scss" scoped>
.anime-collection {
}
</style>
