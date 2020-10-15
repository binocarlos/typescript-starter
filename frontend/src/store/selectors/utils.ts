import { State } from 'router5'
import { createSelector, Selector } from 'reselect'

import {
  NetworkStateLoading,
  NetworkStateErrors,
  RootState,
} from '../../types/store'

import {
  getNetworkName,
} from '../utils/network'

export const networkProps = (prefix: string, fields: string[]) => fields.map(field => {
  return {
    selectorName: field,
    dataField: [prefix, field].join('/'),
  }
})

export const networkLoading: Selector<RootState, NetworkStateLoading> = state => state.network.loading
export const networkErrors: Selector<RootState, NetworkStateErrors> = state => state.network.errors

export const route: Selector<RootState, State | null> = state => state.router.route
export const previousRoute: Selector<RootState, State | null> = state => state.router.previousRoute
export const routeParams: Selector<RootState, Record<string, any>> = state => {
  return state.router.route ?
    state.router.route.params :
    {}
}

export const routeParamId: Selector<RootState, string | null> = createSelector(
  routeParams,
  params => params.id,
)

export const DEFAULT_OBJECT = {}
export const DEFAULT_ARRAY = []

export const networkGroup = (prefix: string, names: string[]) => {
  const group: {
    [name: string]: {
      error: Selector<RootState, string>,
      loading: Selector<RootState, boolean>,
    }
  } = {}
  return names.reduce((all, name) => {
    all[name] = {
      error: state => state.network.errors[getNetworkName(prefix, name)],
      loading: state => state.network.loading[getNetworkName(prefix, name)],
    }
    return all
  }, group)
}