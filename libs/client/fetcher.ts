import axios from 'axios';

/**data fetch with url or headers */
export const getFetch = (url: string, headers?: any) => () =>
  axios
    .get(url, headers)
    .then((res) => res.data)
    .catch((err) => err);

export const postFetch =
  <T>(url: string, data: T, headers?: any) =>
  () =>
    axios.post(url, data, headers).then((res) => res.data);
export const newAxios = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'content-type': 'application/json;charset=UTF-8'
  },
  withCredentials: true
});
