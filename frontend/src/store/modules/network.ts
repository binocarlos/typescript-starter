import {
  CreateReducer,
  CreateAction,
} from '../utils/store'

import {
  NetworkState,
  ReducerHandler,
} from '../../types/store'

import {
  PayloadSetLoading,
  PayloadSetError,
} from '../../types/network'

import {
  GlobalLoadingProps,
} from '../../types/app'

const prefix = 'network'

const initialState: NetworkState = {
  globalLoading: {
    active: false,
  },
  loading: {},
  errors: {},
}

/*

  reducers

*/
const setGlobalLoading: ReducerHandler<NetworkState, GlobalLoadingProps> = (state, action) => {
  state.globalLoading = action.payload
}

const setLoading: ReducerHandler<NetworkState, PayloadSetLoading> = (state, action) => {
  const {
    name,
    value,
  } = action.payload
  state.loading[name] = value
}

const startLoading: ReducerHandler<NetworkState, string> = (state, action) => {
  state.loading[action.payload] = true
}

const stopLoading: ReducerHandler<NetworkState, string> = (state, action) => {
  state.loading[action.payload] = false
}

const setError: ReducerHandler<NetworkState, PayloadSetError> = (state, action) => {
  const {
    name,
    value,
  } = action.payload
  state.errors[name] = value
}

const clearError: ReducerHandler<NetworkState, string> = (state, action) => {
  state.errors[action.payload] = ''
}

/*

  collections

*/
const reducers = {
  setGlobalLoading,
  setLoading,
  startLoading,
  stopLoading,
  setError,
  clearError,
}

export const actions = {
  setGlobalLoading: CreateAction(prefix, `setGlobalLoading`, setGlobalLoading),
  setLoading: CreateAction(prefix, `setLoading`, setLoading),
  startLoading: CreateAction(prefix, `startLoading`, startLoading),
  stopLoading: CreateAction(prefix, `stopLoading`, stopLoading),
  setError: CreateAction(prefix, `setError`, setError),
  clearError: CreateAction(prefix, `clearError`, clearError),
}

export const reducer = CreateReducer<NetworkState>({
  prefix,
  initialState,
  reducers,
})

export default actions