<template>
  <div class="fullscreen bg-black text-white text-center q-pa-md flex flex-center">
    <div class="login-panel">
      <q-input outlined v-model="username" label="Username" />

      <q-input v-model="password" filled :type="hidePassword ? 'password' : 'text'" label="Password" @keydown="onEnter">
        <template v-slot:append>
          <q-icon :name="hidePassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="hidePassword = !hidePassword" />
        </template>
      </q-input>
      <div style="flex: 1"></div>
      <q-btn color="white" text-color="black" label="Login" @click="login" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useGlobal } from '~/composables';
import { service as AuthService } from '~/services/auth.service';

export default defineComponent({
  name: 'page-login',
  setup() {
    const username = ref('');
    const password = ref('');

    const login = async () => {
      const accessToken = await AuthService.login(username.value, password.value);

      if (accessToken?.accessToken) {
        localStorage.setItem('accessToken', accessToken.accessToken);

        // @ts-ignore
        const router = window.router;

        // @ts-ignore
        useGlobal().reload();

        router.push({ path: '/' });
      }
    };

    const onEnter = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        login();
      }
    };
    return { hidePassword: ref(true), password, username, login, onEnter };
  },
});
</script>

<style lang="scss">
.login-panel {
  display: flex;
  flex-direction: column;

  background: #222222;
  box-shadow: 5px 5px 15px 5px #383737;

  width: 370px;
  height: 280px;

  label:first-of-type {
    padding-top: 60px;
  }

  label {
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 10px;
  }
}
</style>
