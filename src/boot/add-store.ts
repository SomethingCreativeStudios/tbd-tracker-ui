import { boot } from 'quasar/wrappers';
import { service as MalService } from '~/services/mal.service';
import { useGlobal } from '~/composables';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async () => {
  const urlParams = new URLSearchParams(window.location.search);

  await useGlobal().reload();

  if (urlParams.get('code')) {
    try {
      await MalService.login(urlParams.get('code'));
      location.replace(window.location.href.split('?')[0]);
    } catch {
      console.log('error auth');
    }
  }
});
