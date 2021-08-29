import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/saga-green/theme.css';
import 'primeflex/primeflex.css';

import { UserModule } from '~/types';

import TextArea from 'primevue/textarea';

export const install: UserModule = ({ app }) => {
   app.use(PrimeVue);

   app.component('prime-textarea', TextArea);
};
