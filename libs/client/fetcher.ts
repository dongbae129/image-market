import axios, { AxiosError, AxiosRequestHeaders } from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import store from 'reducers/store';
import { setAccessToken, setRestoreState } from 'reducers/user';

export const newAxios = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-type': 'application/json;charset=UTF-8'
  },
  withCredentials: true
});
newAxios.interceptors.request.use(
  function (config) {
    // const { accessToken } = useSelector((state: any) => state.user);
    // console.log(accessToken, 'access');
    const { accessToken } = store.getState().user;

    // if (!accessToken) {
    //   config.headers.authorization = null;
    //   return config;
    // }
    if (config.headers && accessToken) {
      config.headers.authorization = `Bearer ${accessToken}`;
      return config;
    }
    // console.log(config, 'request interceptor resolve');
    return config;
  },
  function (error) {
    console.error(error, 'request interceptor error');
    return Promise.reject(error);
  }
);
interface AxiosErrorWithData {
  ok: boolean;
  auth?: {
    checkError: boolean;
    [key: string]: any;
  };
}

newAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err: AxiosError<AxiosErrorWithData>) => {
    const { response, config } = err;

    const originalRequest = config;
    // console.log(response, 'err response');
    if (response?.status === 401) {
      console.log(response, '401');
      if (response?.data?.auth?.checkError) {
        try {
          const { data } = await axios.get('/api/user/restore');
          store.dispatch(setAccessToken(data.accessToken));
          (
            originalRequest.headers as AxiosRequestHeaders
          ).authorization = `Bearear ${store.getState().user.accessToken}`;
          store.dispatch(setRestoreState(true));
          return axios(originalRequest);
          /**여기서 refresh를 이용한 acc 재요청? */
          /**애초에 서버에서 expired면 res에
           *  새로운 acc을 같이 보내면 안되나?
           * 그러면 client에서 재요청만 하면 되니깐 깔끔하지 않나? */
          // store.dispatch(setAccessToken(response.data.accessToken))
        } catch (error) {
          // console.error(error, 'fail to restore');
          // store.dispatch(setRestoreState(false));
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(err);
  }
);
/**data fetch with url or headers */
export const getFetch = (url: string, headers?: any) => () =>
  newAxios
    .get(url, headers)
    .then((res) => res.data)
    .catch((err) => err);

export const postFetch =
  <T>(url: string, data: T, headers?: any) =>
  () =>
    axios.post(url, data, headers).then((res) => res.data);
