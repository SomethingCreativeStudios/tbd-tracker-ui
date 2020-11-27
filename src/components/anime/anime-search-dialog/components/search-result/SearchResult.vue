<template>
   <v-row class="search-result" :class="{ selected: selected }" @click="onClick">
      <v-col class="result__image" cols="4" md="2" sm="2">
         <img :src="imageUrl" />
      </v-col>
      <v-col class="result__text" cols="8" md="10" sm="10">
         <v-col cols="12">
            <div class="result__text--title">{{ name }}</div>
         </v-col>
         <v-col cols="12">
            <div class="result__text--description">{{ description }}</div>
         </v-col>
      </v-col>
   </v-row>
</template>

<script>
export default {
   name: 'search-result',
   props: {
      imageUrl: {
         type: String,
         default: '',
      },
      name: {
         type: String,
         default: '',
      },
      description: {
         type: String,
         default: '',
      },
      selected: {
         type: Boolean,
         default: false,
      },
   },
   methods: {
      onClick() {
         this.$emit('click', !this.selected);
      },
   },
};
</script>

<style lang="scss" scoped>
.search-result {
   padding: 30px;
}

.search-result.selected {
   border: 5px solid black;
}

.search-result.selected,
.search-result:hover {
   background-color: lightgrey;
   cursor: pointer;
}

.result__image {
   img {
      height: 210px;
   }
}

.result__text--title {
   line-height: 33px;
   font-size: 37px;
}

.result__text--description {
   white-space: pre-line;
   max-height: 150px;
   overflow-y: scroll;

   font-size: 27px;
   line-height: 1;
}

@media only screen and (max-width: 600px) {
   .search-result {
      padding: 0px;
   }

   .result__image {
      img {
         height: 110px;
      }
   }

   .result__text--title {
      font-size: 32px;

      line-height: 1;
   }

   .result__text--description {
      max-height: 80px;
      font-size: 20px;
   }
}
</style>
