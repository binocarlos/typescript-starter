import { Selector, createSelector } from 'reselect'
import { State } from 'router5'
import routes from '../../router/routes'
import { findRoute } from '../../router/utils'

import {
  RootState,
} from '../../types/store'

import {
  AppRoute,
} from '../../types/router'

export const route: Selector<RootState, State | null> = state => state.router.route
export const previousRoute: Selector<RootState, State | null> = state => state.router.previousRoute

export const params = createSelector(
  route,
  route => route ? route.params : {},
)

export const idParam = createSelector(
  params,
  params => params.id as string,
)

export const name = createSelector(
  route,
  route => route ? route.name : null,
)

export const fullRoute = createSelector(
  name,
  (name) => name ? findRoute(routes, name) : null,
)

export const segments = createSelector(
  route,
  currentRoute => currentRoute ? currentRoute.name.split('.') : [],
)

export const segment = () => createSelector(
  segments,
  (index: number) => index,
  (segments, index) => segments[index],
)

export const segmentAfter = () => createSelector(
  segments,
  (name: string) => name,
  (segments, name) => {
    const segmentIndex = segments.indexOf(name)
    if(segmentIndex < 0) return null
  return segments[segmentIndex + 1]
  },
)

export const routeNameMap = createSelector(
  () => routes,
  routes => {
    const routeMap: {
      [name: string]: AppRoute,
    } = {}
    const addRoutes = (routes: AppRoute[] | undefined, prefixes: string[] = []) => {
      if(!routes) return
      routes.forEach(route => {
        const routeParts = prefixes.concat([route.name])
        const routeName = routeParts.join('.')
        routeMap[routeName] = route
        addRoutes(route.children, routeParts)
      })
    }
    addRoutes(routes)
    return routeMap
  }
)

export default {
  route,
  previousRoute,
  params,
  idParam,
  name,
  fullRoute,
  segments,
  segment,
  segmentAfter,
  routeNameMap,
}
