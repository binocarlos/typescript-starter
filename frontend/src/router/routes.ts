import auth from './auth'

import {
  AppRoute,
} from '../types/router'

import itemActions from '../store/modules/items'

const routes: AppRoute[] = [
  {
    name: 'home',
    path: '/',
    auth: auth.guest,
  },
  {
    name: 'notfound',
    path: '/notfound',
  },
  {
    name: 'login',
    path: '/login',
    auth: auth.guest,
  },
  {
    name: 'register',
    path: '/register',
    auth: auth.guest,
  },
  {
    name: 'logout',
    path: '/logout',
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    auth: auth.user,
  },
  {
    name: 'items',
    path: '/items',
    auth: auth.user,
    onEnter: [
      async (store) => {
        store.dispatch(itemActions.list())
      },
    ]
  },
  {
    name: 'settings',
    path: '/settings',
    auth: auth.user,
  },
]

export default routes