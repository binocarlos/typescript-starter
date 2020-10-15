import Bluebird from 'bluebird'
import {
  CreateReducer,
  CreateAction,
} from '../utils/store'

import {
  NetworkThunk,
} from '../utils/network'

import {
  setHTTPToken,
  unsetHTTPToken,
  getHTTPTokenHeaders,
  handlers,
} from '../utils/api'

import {
  getNetworkName,
} from '../utils/network'

//import networkWrapper from '../utils/networkWrapper'
import routerActions from './router'
import snackbarActions from './snackbar'

import {
  REFRESH_TOKEN_DELAY,
  ROUTE_LOGGED_IN,
  ROUTE_LOGGED_OUT,
} from '../../settings'

import {
  AuthState,
  ReducerHandler,
  ThunkHandler,
} from '../../types/store'

import {
  PayloadSetUser,
} from '../../types/auth'

import {
  UserQueryLogin,
  UserQueryRegister,
  UserQueryUpdatePassword,
  UserToken,
} from 'typescript-starter-types/src/user'

const prefix = 'auth'

/*

  initial state

*/
const initialState: AuthState = {
  loaded: false,
  data: null,
}

/*

  utils

*/
const setToken = (token: string) => {
  setHTTPToken(token)
  localStorage.setItem('token', token)
}

const unsetToken = () => {
  unsetHTTPToken()
  localStorage.setItem('token', '')
}

let refreshTokenLoop: NodeJS.Timeout | null = null

/*

  reducers

*/
const setUser: ReducerHandler<AuthState, PayloadSetUser> = (state, action) => {
  state.loaded = true
  state.data = action.payload
}

/*

  thunks

*/
const authenticate: ThunkHandler<string, void> = (token) => async (dispatch, getState) => {
  let user: PayloadSetUser = null
  token = token || localStorage.getItem('token') || ''
  if(token) {
    try {
      user = await handlers.get<PayloadSetUser>('/auth/status', {
        headers: getHTTPTokenHeaders(token),
      })
    } catch(e) {

    }
  }
  if(user && user.id) {
    setToken(token)
    dispatch(startTokenLoop())
    dispatch(actions.setUser(user))
  }
  else {
    unsetToken()
    dispatch(actions.setUser(null))
  }
}

const refreshToken: ThunkHandler<void, void> = () => async (dispatch, getState) => {
  try {
    const { token } = await handlers.post<void, UserToken>('/auth/token')
    setToken(token)
  } catch(e) {
    unsetToken()
    dispatch(snackbarActions.setError(`you have been logged out`))
    dispatch(logout())
  }
}

const startTokenLoop: ThunkHandler<void, void> = () => async (dispatch, getState) => {
  if(refreshTokenLoop) {
    clearInterval(refreshTokenLoop as NodeJS.Timeout)
  }
  refreshTokenLoop = setInterval(() => {
    dispatch(refreshToken())
  }, REFRESH_TOKEN_DELAY)
}

const stopTokenLoop: ThunkHandler<void, void> = () => async (dispatch, getState) => {
  if(refreshTokenLoop) {
    clearInterval(refreshTokenLoop as NodeJS.Timeout)
    refreshTokenLoop = null
  }
}

const login: ThunkHandler<UserQueryLogin, void> = (payload) => async (dispatch, getState) => {
  const {
    token,
  } = await handlers.post<UserQueryLogin, UserToken>('/auth/login', payload)
  await dispatch(authenticate(token))
  dispatch(routerActions.navigateTo(ROUTE_LOGGED_IN))
}

const register: ThunkHandler<UserQueryRegister, void> = (payload) => async (dispatch, getState) => {
  const {
    token,
  } = await handlers.post<UserQueryLogin, UserToken>('/auth/register', payload)
  await dispatch(authenticate(token))
  dispatch(routerActions.navigateTo(ROUTE_LOGGED_IN))
}

const logout: ThunkHandler<void, void> = () => async (dispatch, getState) => {
  unsetToken()
  dispatch(actions.setUser(null))
  dispatch(routerActions.navigateTo(ROUTE_LOGGED_OUT))
}

const updateSettings: ThunkHandler<object, void> = (payload) => async (dispatch, getState) => {
  const result = await handlers.put<object, PayloadSetUser>('/auth/settings', payload)
  dispatch(actions.setUser(result))
  dispatch(snackbarActions.setSuccess(`settings updated`))
}

const updatePassword: ThunkHandler<UserQueryUpdatePassword, void> = (payload) => async (dispatch, getState) => {
  const result = await handlers.put<UserQueryUpdatePassword, PayloadSetUser>('/auth/password', payload)
  dispatch(actions.setUser(result))
  dispatch(snackbarActions.setSuccess(`password updated`))
  dispatch(routerActions.navigateTo(ROUTE_LOGGED_IN))
}

/*

  collections

*/
const reducers = {
  setUser,
}

export const actions = {
  setUser: CreateAction(prefix ,'setUser', setUser),
  authenticate,
  refreshToken,
  startTokenLoop,
  stopTokenLoop,
  login: NetworkThunk(prefix, 'login', login, {
    snackbar: true,
    globalLoading: {
      message: 'logging in...',
    },
  }),
  register: NetworkThunk(prefix, 'register', register, {
    snackbar: true,
    globalLoading: {
      message: 'registering...',
    },
  }),
  logout,
  updateSettings,
  updatePassword,
}

export const reducer = CreateReducer<AuthState>({
  prefix,
  initialState,
  reducers,
})

export default actions