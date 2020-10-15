import Bluebird from 'bluebird'
import transitionPath from 'router5-transition-path'
import { findRoutes }  from '../utils'

import {
  MiddlewareFactory,
  RouteTriggerHandler,
} from '../../types/router'

/*

  trigger actions when routes become active

*/
const triggerRoute: MiddlewareFactory = (routes) => (router, dependencies) => async (toState, fromState, done) => {
  const {
    toActivate,
    toDeactivate,
  } = transitionPath(toState, fromState)
  const { store } = dependencies

  const deactiveRoutes = findRoutes(routes, toDeactivate)
  const activeRoutes = findRoutes(routes, toActivate)
  
  const deactiveTriggers = deactiveRoutes.reduce<RouteTriggerHandler[]>((all, route) => {
    return all.concat(route.onLeave || [])
  }, [])

  const activeTriggers = activeRoutes.reduce<RouteTriggerHandler[]>((all, route) => {
    return all.concat(route.onEnter || [])
  }, [])

  await Bluebird.each(deactiveTriggers, async trigger => {
    await trigger(store, fromState.params)
  })

  await Bluebird.each(activeTriggers, async trigger => {
    await trigger(store, toState.params)
  })
}

export default triggerRoute