import { createSelector, Selector } from 'reselect'
import { networkGroup } from './utils'

import {
  RootState,
} from '../../types/store'

import {
  MenuItem,
} from '../../types/app'

import authSelectors from './auth'

import {
  getAppMenu,
  getMainMenu,
  getDashboardMenu,
} from '../../menus'

export const initialised: Selector<RootState, boolean> = state => state.system.initialised

export const appMenu: Selector<RootState, MenuItem[]> = createSelector(
  authSelectors.data,
  (user) => getAppMenu(user),
)

export const mainMenu: Selector<RootState, MenuItem[]> = createSelector(
  authSelectors.data,
  (user) => getMainMenu(user),
)

export const dashboardMenu: Selector<RootState, MenuItem[]> = createSelector(
  authSelectors.data,
  (user) => getDashboardMenu(user),
)

export const network = networkGroup('system', [
  'initialise',
])

export default {
  initialised,
  appMenu,
  mainMenu,
  dashboardMenu,
  network,
}