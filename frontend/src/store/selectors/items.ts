import { Selector } from 'reselect'
import { networkGroup } from './utils'

import {
  ItemRecord,
} from 'typescript-starter-types/src/database_records'

import {
  RootState,
} from '../../types/store'

export const data: Selector<RootState, ItemRecord[]> = state => state.items.data

export const network = networkGroup('items', [
  'list',
  'create',
  'update',
  'delete',
])

export default {
  data,
  network,
}