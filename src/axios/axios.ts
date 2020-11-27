import Axios from 'axios';
import axios from 'axios';

const tbaAxios = axios.create({
   baseURL: process.env.VUE_APP_SERVER_PATH,
   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

tbaAxios.interceptors.response.use(
   response => {
      return response;
   },
   async error => {
      console.error(error);
      if (401 === error?.response?.status) {
         const token = await tbaAxios.post('/Users/auth', {
            username: process.env.VUE_APP_USERNAME,
            password: process.env.VUE_APP_PASSWORD,
            ttl: 86000,
         });

         localStorage.setItem('token', token.data.accessToken);
      }
   }
);

export default tbaAxios;
