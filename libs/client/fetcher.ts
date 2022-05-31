import axios from 'axios';

export const getFetch = (url: string, headers?: any) => () =>
  axios.get(url, headers).then((res) => res.data);

export const newAxios = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'content-type': 'application/json;charset=UTF-8'
  },
  withCredentials: true
});
