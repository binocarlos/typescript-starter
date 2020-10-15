import axios, {
  AxiosError,
  Method,
} from 'axios'

import { API_URL } from '../../settings'

import {
  GetState,
} from '../../types/store'

export const getHTTPTokenHeaders = (token: string): {
  Authorization: string,
} => ({
  Authorization: token ? `Bearer ${token}` : '',
})

export const setHTTPToken = (token: string) => {
  axios.defaults.headers.common = getHTTPTokenHeaders(token)
}

export const unsetHTTPToken = () => {
  axios.defaults.headers.common = getHTTPTokenHeaders('')
}

// pluck an error message from the response body if present
export const getErrorMessage = (error: AxiosError): string => {
  const res = error.response
  let message = ''
  if(res && res.data) {
    message = res.data.error || res.data.message
  }
  message = message || error.toString()
  return message.replace(/^Error\: Error\:/, 'Error:')
}

export const getUrl = (path: string): string => `${API_URL}${path}`

function read(method: Method, baseUrl: string) {
  return async function<ResponseType>(url: string, extra?: {[name: string]: any}) {
    return axios.request<ResponseType>({
      method,
      url: `${baseUrl}${url}`,
      ...extra,
    }).then(res => res.data)
  }
}

function write(method: Method, baseUrl: string) {
  return async function<RequestType, ResponseType>(url: string, data?: RequestType, extra?: {[name: string]: any}) {
    return axios.request<ResponseType>({
      method,
      url: `${baseUrl}${url}`,
      data,
      ...extra,
    }).then(res => res.data)
  }
}

const getHandlers = (baseUrl: string) => ({
  get: read('get', baseUrl),
  post: write('post', baseUrl),
  put: write('put', baseUrl),
  delete: read('delete', baseUrl),
})

export const handlers = getHandlers(API_URL)
