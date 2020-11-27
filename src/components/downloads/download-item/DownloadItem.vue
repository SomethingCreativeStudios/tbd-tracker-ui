<template>
   <v-card class="download-item">
      <v-list-item two-line>
         <v-list-item-content>
            <v-list-item-title class="headline"> {{ name }} ({{ timeLeft }}) </v-list-item-title>
         </v-list-item-content>
      </v-list-item>
      <v-card-text>
         <v-progress-linear :value="progress * 100" color="green" height="25">
            <template v-slot:default="{ value }">
               <strong>{{ Math.ceil(value) }}% ({{ downloadSpeed }})</strong>
            </template>
         </v-progress-linear>
      </v-card-text>
   </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
   name: 'download-item',
   components: {},
   props: {
      hash: {
         type: String,
         default: '',
      },
      name: {
         type: String,
         default: '',
      },
      progress: {
         type: Number,
         default: 0,
      },
      speed: {
         type: Number,
         default: 0,
      },
      timeLeft: {
         type: String,
         default: '',
      },
   },
   data() {
      return {};
   },
   computed: {
      downloadSpeed() {
         var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
         if (this.speed == 0) return 'n/a';
         var i = parseInt(Math.floor(Math.log(this.speed) / Math.log(1024)) + '');
         if (i == 0) return this.speed + ' ' + sizes[i];
         return (this.speed / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
      },
   },
   methods: {},
});
</script>

<style lang="scss" scoped></style>
