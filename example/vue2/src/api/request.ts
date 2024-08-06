import axios, { AxiosError, AxiosInstance, AxiosResponse, Method } from 'axios'
import Cookies from 'js-cookie'

export interface InternalRequest {
  request: (
    path: string,
    method: Method,
    params?: Record<string, any>,
    headers?: Record<string, any>
  ) => Promise<AxiosResponse<any, any>>
  get: (
    path: string,
    params?: Record<string, any>
  ) => Promise<AxiosResponse<any, any>>
  post: (
    path: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ) => Promise<AxiosResponse<any, any>>
  put: (
    path: string,
    params?: Record<string, any>
  ) => Promise<AxiosResponse<any, any>>
  delete: (
    path: string,
    params?: Record<string, any>
  ) => Promise<AxiosResponse<any, any>>
}

// 创建内部remote
const internalRemote = axios.create()
internalRemote.defaults.baseURL = '/'
internalRemote.defaults.timeout = 100000
internalRemote.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器
internalRemote.interceptors.request.use((config) => {
  config.headers['Access-Token'] = Cookies.get('Access-Token')
  return config
})

function handleSuccess(res: AxiosResponse): Promise<AxiosResponse> {
  return Promise.resolve(res)
}

/**
 * response错误处理，包含消息提示
 * @param err
 */
function handleResError(err: AxiosError, errorValue?: any) {
  console.error(err)
  return Promise.resolve(errorValue || err.response)
}

class InternalRequestImpl implements InternalRequest {
  constructor(private axiosRequest: AxiosInstance) {}

  request(
    path: string,
    method: Method,
    params?: Record<string, any>,
    headers?: Record<string, any>
  ) {
    if (method === 'GET') {
      return this.axiosRequest.request({ url: path, method, params, headers })
    } else {
      return this.axiosRequest.request({
        url: path,
        method,
        data: params,
        headers,
      })
    }
  }
  get(path: string, params?: Record<string, any>) {
    return this.axiosRequest.request({
      url: path,
      method: 'GET',
      params,
    })
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
    })
  }
  put(path: string, params?: Record<string, any>) {
    return this.axiosRequest.request({
      url: path,
      method: 'PUT',
      data: params,
    })
  }
  delete(path: string, params?: Record<string, any>) {
    return this.axiosRequest.request({
      url: path,
      method: 'DELETE',
      data: params,
    })
  }
}

const useRequest = () => {
  const axiosRequest = axios.create()
  internalRemote.interceptors.response.clear()
  internalRemote.interceptors.response.use(
    (res: AxiosResponse) => {
      return handleSuccess(res)
    },
    (err: Error) => {
      if (err instanceof AxiosError) {
        return handleResError(err, undefined)
      } else {
        return Promise.reject(err)
      }
    }
  )
  return new InternalRequestImpl(axiosRequest)
}

export default useRequest
