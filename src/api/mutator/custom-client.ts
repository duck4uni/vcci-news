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

// Helper function to convert RequestInit headers to Axios format
const convertHeaders = (headers?: HeadersInit): Record<string, string> | undefined => {
  if (!headers) return undefined
  
  if (headers instanceof Headers) {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }
  
  if (Array.isArray(headers)) {
    const result: Record<string, string> = {}
    headers.forEach(([key, value]) => {
      result[key] = value
    })
    return result
  }
  
  return headers as Record<string, string>
}

const useCustomClient = <T>(url: string, options?: RequestInit): Promise<T> => {
  const source = Axios.CancelToken.source()
  
  // Convert RequestInit to AxiosRequestConfig
  const axiosConfig: AxiosRequestConfig = {
    url,
    method: options?.method || 'GET',
    headers: convertHeaders(options?.headers),
    data: options?.body,
    signal: options?.signal || undefined,
    cancelToken: source.token
  }

  const promise = AXIOS_INSTANCE(axiosConfig).then(({ data, status }) => {
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
