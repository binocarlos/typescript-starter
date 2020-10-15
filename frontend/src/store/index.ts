import {
  combineReducers,
  applyMiddleware,
  createStore,
  compose,
} from 'redux'
import thunk from 'redux-thunk'
import { Router } from 'router5'
import { router5Middleware } from 'redux-router5'

import { reducer as auth } from './modules/auth'
import { reducer as fileupload } from './modules/fileupload'
import { reducer as network } from './modules/network'
import { reducer as router } from './modules/router'
import { reducer as snackbar } from './modules/snackbar'
import { reducer as system } from './modules/system'
import { reducer as items } from './modules/items'

const coreReducers = {
  auth,
  fileupload,
  network,
  router,
  snackbar,  
  system,
  items,
}

interface StoreProps {
  router: Router<Record<string, any>>,
  initialState: Record<string, any>,
}

const Store = ({
  router,
  initialState = {},
}: StoreProps) => {

  const reducer = combineReducers(coreReducers)
    
  let middleware = [
    router5Middleware(router),
    thunk,
  ]

  const storeEnhancers = [
    applyMiddleware(...middleware),
  ]

  if(window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) storeEnhancers.push((window as any).__REDUX_DEVTOOLS_EXTENSION__({
    shouldHotReload: false,
  }))

  const store = createStore(
    reducer,
    initialState,
    compose(...storeEnhancers)
  )

  router.setDependency('store', store)

  return store
}

export default Store