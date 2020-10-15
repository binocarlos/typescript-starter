import React, { FC } from 'react'
import { Store, AnyAction } from 'redux'
import { Router } from 'router5'
import { Provider } from 'react-redux'
import Theme from './theme'
import App from './app'

interface RootProps {
  store: Store<any, AnyAction>,
  router: Router<Record<string, any>>,
}

const Root: FC<RootProps> = ({
  store,
  router,
}) => {
  return (
    <Provider store={ store }>
      <Theme>
        <App
          router={ router }
        />
      </Theme>
    </Provider>
  )
}

export default Root
