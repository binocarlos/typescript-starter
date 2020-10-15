import {
  AxiosError,
} from 'axios'

import {
  ThunkHandler,
  NetworkThunkOptions,
} from '../../types/store'

import networkActions from '../modules/network'
import snackbarActions from '../modules/snackbar'

function isAxiosError(error: Error | AxiosError): error is AxiosError {
  return (error as AxiosError).response !== undefined
}

const getNetworkErrorMessage = (e: Error | AxiosError): string => {
  if (isAxiosError(e)) {
    if(e.response) {
      const data = e.response.data
      if(data && data.error) {
        return data.error
      }
    }
  }
  return e.toString()
}

export const getNetworkName = (prefix: string, name: string): string =>
  `${prefix}.${name}`

export function NetworkThunk<PayloadType, ReturnType>(prefix: string, name: string, handler: ThunkHandler<PayloadType, ReturnType>, options: NetworkThunkOptions = {}): ThunkHandler<PayloadType, ReturnType> {
  const wrapper: ThunkHandler<PayloadType, ReturnType> = (payload) => async (dispatch, getState) => {
    const handlerFn = handler(payload)
    const networkName = getNetworkName(prefix, name)
    let returnResult: ReturnType | void
    if(options.globalLoading) {
      dispatch(networkActions.setGlobalLoading({
        active: true,
        ...options.globalLoading,
      }))
    }
    dispatch(networkActions.setLoading({
      name: networkName,
      value: true,
    }))
    dispatch(networkActions.setError({
      name: networkName,
      value: '',
    }))
    try {
      returnResult = await handlerFn(dispatch, getState, {})
    } catch (e) {
      const errorMessage = getNetworkErrorMessage(e)
      dispatch(networkActions.setError({
        name: networkName,
        value: errorMessage,
      }))
      if(options.snackbar) {
        dispatch(snackbarActions.setError(errorMessage))
      }
    }
    dispatch(networkActions.setLoading({
      name: networkName,
      value: false,
    }))
    if(options.globalLoading) {
      dispatch(networkActions.setGlobalLoading({
        active: false,
      }))
    }
    return returnResult
  }
  return wrapper
}
