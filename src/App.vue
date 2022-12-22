<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Router } from 'vue-router';
import { service as AuthService } from '~/services/auth.service';

export default defineComponent({
  name: 'App',
  setup() {
    const redirect = async () => {
      const isValid = await AuthService.validateToken(localStorage.getItem('accessToken'));

      if (!isValid) {
        //@ts-ignore
        const router = window.router as Router;
        localStorage.removeItem('accessToken');

        router.push({ path: 'login' });
      }
    };

    redirect();
  },
});
</script>
