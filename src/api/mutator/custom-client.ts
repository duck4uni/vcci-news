import Axios, { AxiosError, AxiosRequestConfig } from 'axios'
import config from '@/links/index'
import useAuthStore from '@/store/useAuthStore'
const { siteURL } = config

const AXIOS_INSTANCE = Axios.create({ baseURL: config.apiEndpoint })

AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${useAuthStore.getState().appAccessToken ?? ''}`

  if (typeof window !== 'undefined') {
    config.headers['IsAdmin'] = window.location.pathname.includes('/admin/')
  } else {
    config.headers['Origin'] = siteURL
  }

  if (config.method === 'post' && config.url?.includes('/exportJoinedOrgs')) {
    config.responseType = 'blob'
    config.headers['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
  }

  return config
})

AXIOS_INSTANCE.interceptors.response.use(
  async (response) => response,
  (error) => Promise.reject(error)
)

const useCustomClient = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source()
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token
  }).then(({ data, status }) => {
    return data instanceof Blob ? data : { ...data, statusCode: status }
  })

  // @ts-expect-error not exist cancel
  promise.cancel = () => {
    source.cancel('Query was cancelled')
  }
  return promise
}

export { useCustomClient }

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this

export type ErrorType<Error> = AxiosError<Error>

export type BodyType<BodyData> = BodyData

// Or, in case you want to wrap the body type (optional)

// (if the custom instance is processing data before sending it, like changing the case for example)
// export type BodyType<BodyData> = CamelCase<BodyData>;
