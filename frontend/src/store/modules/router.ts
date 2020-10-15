import { 
  actions as coreActions,
  router5Reducer as coreReducer,
} from 'redux-router5'

import routerSelectors from '../selectors/router'

import {
  RouterState,
  ThunkHandler,
  ModuleReducer,
} from '../../types/store'

import {
  RouterParams,
} from '../../types/router'

const navigateTo = coreActions.navigateTo

const setQueryParams: ThunkHandler<RouterParams, void> = (params = {}) => async (dispatch, getState) => {
  const route = routerSelectors.route(getState())
  if(!route) return
  dispatch(coreActions.navigateTo(route.name, params))
}

const addQueryParams: ThunkHandler<RouterParams, void> = (params = {}) => async (dispatch, getState) => {
  const route = routerSelectors.route(getState())
  if(!route) return
  const queryParams = routerSelectors.params(getState())
  const newParams = Object.assign({}, queryParams)
  Object
    .keys(params)
    .forEach(id => {
      const newValue = params[id]
      if(!newValue) delete(newParams[id])
      else newParams[id] = newValue
    })
  dispatch(coreActions.navigateTo(route.name, newParams))
}

const removeQueryParams: ThunkHandler<RouterParams, void> = (params = {}) => async (dispatch, getState) => {
  const route = routerSelectors.route(getState())
  if(!route) return
  const queryParams = routerSelectors.params(getState())
  const baseParams: RouterParams = {}
  const newParams = Object
    .keys(queryParams)
    .filter(id => {
      return typeof(params) === 'function' ?
        params(id) :
        params[id] ? false : true
    })
    .reduce((all, id) => {
      all[id] = queryParams[id]
      return all
    }, baseParams)
  dispatch(coreActions.navigateTo(route.name, newParams))
}

const clearQueryParams: ThunkHandler<void, void> = () => async (dispatch, getState) => {
  const route = routerSelectors.route(getState())
  if(!route) return
  dispatch(coreActions.navigateTo(route.name))
}

export const actions = {
  navigateTo,
  setQueryParams,
  addQueryParams,
  removeQueryParams,
  clearQueryParams,
}

const reducer = coreReducer as ModuleReducer<RouterState>

export {
  reducer
}

export default actions