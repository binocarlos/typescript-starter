import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import Route from './Route'
import RouteContext from './RouteContext'
import Loading from '../components/system/Loading'

import routerSelectors from '../store/selectors/router'

import Layout from '../pages/Layout'
import NotFound from '../pages/NotFound'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Logout from '../pages/Logout'
import Dashboard from '../pages/Dashboard'
import Settings from '../pages/Settings'
import Items from '../pages/Items'

const Router: FC = ({
  children,
}) => {
  const route = useSelector(routerSelectors.route)

  if(!route) {
    return (
      <Loading />
    )
  }

  return (
    <RouteContext.Provider value={ route.name }>
      <Layout>
        <Route segment="notfound" exact>
          <NotFound />
        </Route>
        <Route segment="home" exact>
          <Login />
        </Route>
        <Route segment="login" exact>
          <Login />
        </Route>
        <Route segment="register" exact>
          <Register />
        </Route>
        <Route segment="logout" exact>
          <Logout />
        </Route>
        <Route segment="dashboard" exact>
          <Dashboard />
        </Route>
        <Route segment="settings" exact>
          <Settings />
        </Route>
        <Route segment="items" exact>
          <Items />
        </Route>
        {
          children
        }
      </Layout>
    </RouteContext.Provider>
  )
}

export default Router