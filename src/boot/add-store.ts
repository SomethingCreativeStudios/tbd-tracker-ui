import { boot } from 'quasar/wrappers';
import { useSeries, useSetting, useSubgroup, useSubgroupRule } from '~/composables';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async () => {
  console.log('test');

  const { setUp: setUpSeries } = useSeries();
  const { setUp: setUpSetting } = useSetting();
  const { setUp: setUpSubgroup } = useSubgroup();
  const { setUp: setUpSubgroupRule } = useSubgroupRule();

  await setUpSetting();
  await setUpSeries();
  await setUpSubgroup();
  await setUpSubgroupRule();
  console.log('DONE?');
});