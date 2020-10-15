import userSelectors from '../store/selectors/auth'

import {
  RouteAuthenticateHandler,
} from '../types/router'

import {
  ROUTE_LOGGED_IN,
  ROUTE_LOGGED_OUT,
} from '../settings'

export const user: RouteAuthenticateHandler = store =>
  userSelectors.data(store.getState()) ? null : ROUTE_LOGGED_OUT

export const admin: RouteAuthenticateHandler = store => {
  const user = userSelectors.data(store.getState())
  return !user || !user.meta || user.meta.admin !== true ?
    ROUTE_LOGGED_OUT :
    null
}

export const guest: RouteAuthenticateHandler = store =>
  userSelectors.data(store.getState()) ? ROUTE_LOGGED_IN : null

export default {
  user,
  admin,
  guest,
}