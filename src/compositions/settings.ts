import { Settings } from '@/models/settings';
import axios from '~/axios/axios';

export async function fetchSettings(): Promise<Settings[]> {
   const settings = await axios.get('/settings');

   return settings.data;
}

export async function setSetting(key: string, value: string): Promise<Settings> {
   const settings = await axios.put(`/settings/${key}`, { value });

   return settings.data;
}
