import transitionPath from 'router5-transition-path'
import { findRoutes }  from '../utils'

import snackbarActions from '../../store/modules/snackbar'

import {
  RouteAuthenticateHandler,
  MiddlewareFactory,
} from '../../types/router'

/*

  run an authorize function on the route if present

  if the function returns a string - redirect there
  otherwise allow the route

*/
const authorizeRoute: MiddlewareFactory = (routes) => (router, dependencies) => (toState, fromState, done) => {
  const { toActivate } = transitionPath(toState, fromState)
  const { store } = dependencies

  const routeError = (message: string) => {
    console.error(message)
    store.dispatch(snackbarActions.setError(message))
    done(message)
  }

  const authorizeHandlers = findRoutes(routes, toActivate)
    .map(route => route.auth)
    .filter((auth): auth is RouteAuthenticateHandler => auth !== null)

  if(authorizeHandlers.length <= 0) return done()  
  if(authorizeHandlers.length > 1) return routeError(`multiple authorize settings found in route`)

  const authorizeHandler = authorizeHandlers[0]
  const redirectTo = authorizeHandler(store)

  if(!redirectTo) {
    done()
  }
  else {
    done({
      redirect: {
        name: redirectTo,
      },
    })
  }
}

export default authorizeRoute