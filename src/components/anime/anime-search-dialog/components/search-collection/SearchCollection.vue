<template>
   <div class="search-collection">
      <template v-for="(result, index) in results">
         <search-result
            :key="result.title"
            v-bind="result"
            :selected="selectedIndexes.includes(index)"
            @click="onClick(index, $event)"
         ></search-result>
      </template>
   </div>
</template>

<script>
import { clone } from 'ramda';
import SearchResult from '../search-result';

export default {
   name: 'search-collection',
   components: { SearchResult },
   props: {
      results: {
         type: Array,
         default: () => [],
      },

      multiSelect: {
         type: Boolean,
         default: false,
      },

      defaultSelected: {
         type: Boolean,
         default: false,
      },
   },
   data() {
      return {
         selectedIndexes: [],
      };
   },
   watch: {
      results() {
         this.selectedIndexes = this.defaultSelected ? this.results.map((_, index) => index) : [];

         if (this.defaultSelected) {
            this.$emit(
               'selected',
               this.selectedIndexes.map(i => clone(this.results[i]))
            );
         }
      },
   },
   methods: {
      onClick(index, selected) {
         if (this.multiSelect) {
            this.selectMulti(index, selected);
         } else {
            this.selectedIndexes = selected ? [index] : [];
         }

         this.$emit(
            'selected',
            this.selectedIndexes.map(i => clone(this.results[i]))
         );
      },

      selectMulti(index, selected) {
         if (!selected) {
            this.selectedIndexes = this.selectedIndexes.filter(found => found !== index);
         } else {
            this.selectedIndexes.push(index);
         }
      },
   },
};
</script>

<style lang="sass" scoped></style>
