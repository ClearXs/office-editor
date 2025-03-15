import axios, { AxiosError, AxiosInstance, AxiosResponse, Method } from 'axios';
import { DocUser } from 'interface';
import { useCallback } from 'react';
import { toast } from 'react-toast';
import Result from '../services/model/result';
import * as header from '../constant/header';

export interface AxiosRequest {
  request: (
    path: string,
    method: Method,
    params?: Record<string, any>,
    headers?: Record<string, any>
  ) => Promise<AxiosResponse<any, any>>;
  get: (
    path: string,
    params?: Record<string, any>
  ) => Promise<AxiosResponse<any, any>>;
  post: (
    path: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ) => Promise<AxiosResponse<any, any>>;
  put: (
    path: string,
    params?: Record<string, any>
  ) => Promise<AxiosResponse<any, any>>;
  delete: (
    path: string,
    params?: Record<string, any>
  ) => Promise<AxiosResponse<any, any>>;
}

export class RequestImpl implements AxiosRequest {
  constructor(private axiosRequest: AxiosInstance) {}

  request(
    path: string,
    method: Method,
    params?: Record<string, any>,
    headers?: Record<string, any>
  ) {
    if (method === 'GET') {
      return this.axiosRequest.request({ url: path, method, params, headers });
    } else {
      return this.axiosRequest.request({
        url: path,
        method,
        data: params,
        headers,
      });
    }
  }

  get(path: string, params?: Record<string, any>) {
    return this.axiosRequest.request({
      url: path,
      method: 'GET',
      params,
    });
  }

  post(
    path: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ) {
    return this.axiosRequest.request({
      url: path,
      method: 'POST',
      data: params,
      headers,
    });
  }

  put(path: string, params?: Record<string, any>) {
    return this.axiosRequest.request({
      url: path,
      method: 'PUT',
      data: params,
    });
  }

  delete(path: string, params?: Record<string, any>) {
    return this.axiosRequest.request({
      url: path,
      method: 'DELETE',
      data: params,
    });
  }
}

// issue：
// 为什么使用request hook，因为需要错误处理的跳转，而期望又只能有一个实例，所以使用useEffect，
// 但useEffect的渲染将晚于使用它的组件，故报null。考虑创建全局axios的一个实例
const useRequest = (baseUrl: string, docUser: DocUser, cipher: string) => {
  /**
   * resolve response
   * according response status:
   * condition of status 200: once again code of data
   * condition of status 401: authentication error. redirect to login page
   * condition of status 404: not found error. redirect to error page
   * condition of other: redirect to error
   *
   */
  const resolveResponse = useCallback((res: AxiosResponse): Promise<any> => {
    const { status, data } = res;

    if (status === 200) {
      const { code, message } = data as Result<any>;
      if (code === 200) {
        return Promise.resolve(res);
      } else if (code === 500) {
        handleInternalError(message);
        return Promise.reject(data);
      } else {
        return Promise.reject(new Error('unknown error'));
      }
    } else {
      return resolveIncorrectResponse(res);
    }
  }, []);

  const resolveIncorrectResponse = useCallback(
    (error: AxiosResponse): Promise<any> => {
      const {
        status,
        config: { url },
        statusText,
      } = error;
      if (status === 401) {
        const message = 'authentication failed';
        handleFailedAuthentication(message);
        return Promise.reject(new Error(message));
      } else if (status === 404) {
        const message = `not found ${url} service`;
        handleNotFound(message);
        return Promise.reject(new Error(message));
      } else {
        return Promise.reject(new Error(`unknown error: ${statusText}`));
      }
    },
    []
  );

  const handleFailedAuthentication = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const handleNotFound = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const handleInternalError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const axiosRequest = axios.create();
  axiosRequest.defaults.baseURL = baseUrl;
  axiosRequest.defaults.timeout = 10000;
  axiosRequest.defaults.headers.post['Content-Type'] = 'application/json';

  // 请求拦截器
  axiosRequest.interceptors.request.use((config) => {
    // 设置请求头
    config.headers.set(header.X_CIPHER_USER, JSON.stringify(docUser));
    config.headers.set(header.X_CIPHER, cipher);
    return config;
  });

  axiosRequest.interceptors.response.use(
    (res) => resolveResponse(res),
    (err) => {
      if (err instanceof AxiosError) {
        return resolveIncorrectResponse(err.response!);
      } else {
        return Promise.reject(err);
      }
    }
  );

  return new RequestImpl(axiosRequest);
};

export default useRequest;
