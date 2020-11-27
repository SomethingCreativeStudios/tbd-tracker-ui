<template>
   <v-dialog v-model="dialog" persistent :max-width="maxWidth">
      <template #activator="{ on, attrs }">
         <slot name="activator" v-bind:attrs="attrs" v-bind:on="on">
            <v-btn v-bind="attrs" v-on="on">
               Open Dialog
            </v-btn>
         </slot>
      </template>
      <v-card>
         <v-card-title class="headline">
            <slot name="headline">
               Are you sure?
            </slot>
         </v-card-title>
         <v-card-text>
            <slot name="message">
               This will really do it
            </slot>
         </v-card-text>
         <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="onConfirm">
               <slot name="confirm">
                  Confirm
               </slot>
            </v-btn>
            <v-btn color="red darken-1" text @click="onCancel">
               <slot name="cancel">
                  Cancel
               </slot>
            </v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script>
export default {
   name: 'confirm-dialog',
   props: {
      show: {
         type: Boolean,
         default: false,
      },
      maxWidth: {
         type: Number,
         default: 240,
      },
   },
   data() {
      return {
         dialog: false,
      };
   },
   watch: {
      show: {
         handler() {
            this.dialog = this.show;
         },
         immediate: true,
      },
   },
   methods: {
      onCancel() {
         this.dialog = false;
         this.$emit('update:dialog', false);
         this.$emit('cancel');
      },
      onConfirm() {
         this.dialog = false;
         this.$emit('update:dialog', false);
         this.$emit('confirm');
      },
   },
};
</script>

<style lang="scss" scoped></style>
