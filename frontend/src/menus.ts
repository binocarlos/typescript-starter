import {
  UserRecord,
} from 'typescript-starter-types/src/database_records'

import {
  MenuItem,
} from './types/app'

import authActions from './store/modules/auth'

export const GUEST_MENU = [{
  title: 'Login',
  link: 'login',
  icon: 'login',
},{
  title: 'Register',
  link: 'register',
  icon: 'register',
}]

export const getAppMenu = (user: UserRecord | null): MenuItem[] => {
  if(!user) return []
  return [{
    title: 'Items',
    icon: 'item',
    link: 'items'
  },{
    title: 'Settings',
    icon: 'settings',
    link: 'settings'
  }]
}

export const getDashboardMenu = (user: UserRecord | null): MenuItem[] => {
  if(!user) return []
  return getAppMenu(user)
}

export const getMainMenu = (user: UserRecord | null): MenuItem[] => {
  if(!user) return GUEST_MENU

  const appMenu = getAppMenu(user)

  const beforeAppMenu: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      link: 'dashboard'
    },
    {
      title: '-',
    },
  ]

  const afterAppMenu: MenuItem[] = [
    {
      title: '-',
    },
    {
      title: 'Logout',
      icon: 'logout',
      handler: (dispatch, getState) => {
        dispatch(authActions.logout())
      },
    },
  ]

  return beforeAppMenu
    .concat(appMenu)
    .concat(afterAppMenu)
}

