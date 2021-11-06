import axios, { AxiosRequestConfig } from 'axios';
import { Toast } from '@douyinfe/semi-ui';
import qs from 'query-string';
// import { history } from 'routes/history';

const axiosInstance = axios.create({
  timeout: 6000,
});

axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  config => {
    if (config.data?.CODE !== 'ok') {
      Toast.error(config.data.MESSAGE);
    }
    return config?.data;
  },
  error => {
    // if needs to navigate to login page when request exception
    // history.replace('/login');
    let errorMessage = '系统异常';
    if (error?.message?.includes('Network Error')) {
      errorMessage = '网络错误，请检查您的网络';
    } else {
      errorMessage = error?.message;
    }
    console.dir(error);
    error.message && Toast.error(errorMessage);
    return {
      ACTION: false,
      CODE: 'ERROR',
      MESSAGE: '系统繁忙，请稍微再试',
      DATA: null,
    };
  },
);

export type Response<T = any> = {
  ACTION: string;
  CODE: 'ok' | string;
  MESSAGE: string;
  DATA: T;
};

type Method = 'get' | 'post';

export type MyResponse<T = any> = Promise<Response<T>>;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = <T = any>(
  method: Method,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): MyResponse<T> => {
  const params = Object.assign(data, { api_action: url });
  if (method === 'post') {
    return axiosInstance.post('api', qs.stringify(params), config);
  } else {
    return axiosInstance.get('/api', {
      params,
      ...config,
    });
  }
};