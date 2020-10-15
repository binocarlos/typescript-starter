import React, { useEffect, FC } from 'react'
import { useSelector } from 'react-redux'
import { Router as RouterType } from 'router5'
import { RouterProvider } from 'react-router5'
import Loading from './components/system/Loading'

import systemSelectors from './store/selectors/system'
import systemActions from './store/modules/system'

import useDispatchThunk from './components/hooks/withDispatchThunk'

import Router from './router/Router'

interface AppProps {
  router: RouterType,
}

const App: FC<AppProps> = ({
  router,
  children,
}) => {
  const dispatch = useDispatchThunk()
  const initialised = useSelector(systemSelectors.initialised)
  
  useEffect(() => {
    const initialise = async () => {
      await dispatch(systemActions.initialise())
      router.start()
    }
    initialise()
  }, [])

  if(!initialised) {
    return (
      <Loading />
    )
  }

  return (
    <RouterProvider router={ router }>
      <Router>
        { children }
      </Router>
    </RouterProvider>
  )
}

export default App
