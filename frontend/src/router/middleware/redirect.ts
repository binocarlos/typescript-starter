import transitionPath from 'router5-transition-path'
import { findRoutes }  from '../utils'

import routerActions from '../../store/modules/router'

import {
  MiddlewareFactory,
} from '../../types/router'

/*

  if the active route has a redirect property - redirect there

*/
const redirectRoute: MiddlewareFactory = (routes) => (router, dependencies) => (toState, fromState, done) => {
  const { toActivate } = transitionPath(toState, fromState)
  const { store } = dependencies

  const activeRoutes = findRoutes(routes, toActivate)
  const activeRoute = activeRoutes[activeRoutes.length-1]

  if(!activeRoute) return done()

  const redirectInfo = activeRoute.redirect
  const redirectParams = activeRoute.redirectParams || {}

  if(!redirectInfo) return done()

  let redirectTo = null

  // if the redirect is a string - redirect there
  if(typeof(redirectInfo) === 'string') {
    redirectTo = redirectInfo
  }
  // if it's a function - run the function passing the redux state
  // the function should return the redirect or falsey value for don't redirect
  else if(typeof(redirectInfo) === 'function') {
    redirectTo = redirectInfo(store.getState())
  }
  else {
    return done(`unknown type of redirect info: ${typeof(redirectInfo)}`)
  }

  if(redirectTo && redirectTo != activeRoute.name) {
    done({
      redirect: {
        name: redirectTo,
        params: Object.assign({}, toState.params, redirectParams),
      },
    })
  }
  else {
    done()
  }
}

export default redirectRoute