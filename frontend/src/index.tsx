import React from 'react'
import ReactDOM from 'react-dom'

import Router from './router'
import routes from './router/routes'
import Store from './store'

const initialState: Record<string, any> = (window as any).__INITIAL_STATE__ || {}

const router = Router(routes)

const store = Store({
  router,
  initialState,
})

const rootEl = document.querySelector('#root')

let render = () => {
  const RootAppComponent = require('./root').default
  ReactDOM.render(
    <RootAppComponent
      store={ store }
      router={ router }
    />,
    rootEl
  )
}

if(module['hot']) {
  module['hot'].accept('./root', () => {
    setTimeout(render)
  })
}

render()
