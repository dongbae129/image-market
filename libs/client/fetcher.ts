import axios from 'axios';

export const getFetch = (url: string, headers: any) => () =>
  axios.get(url, headers).then((res) => res.data);
