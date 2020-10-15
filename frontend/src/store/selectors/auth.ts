import { Selector } from 'reselect'
import { networkGroup } from './utils'

import {
  UserRecord,
} from 'typescript-starter-types/src/database_records'

import {
  RootState,
} from '../../types/store'

export const loaded: Selector<RootState, boolean> = state => state.auth.loaded
export const data: Selector<RootState, UserRecord | null> = state => state.auth.data
export const network = networkGroup('auth', [
  'login',
  'register',
])

export default {
  loaded,
  data,
  network,
}