import {
  Store,
} from './store'

import {
  Settings,
} from './system'

import {
  StorageController,
} from 'typescript-starter-types/src/storage'

import {
  UserController,
} from 'typescript-starter-types/src/user'

import {
  ItemController,
} from 'typescript-starter-types/src/item'

export interface Controller {
  storage: StorageController,
  user: UserController,
  item: ItemController,
}

export interface ControllerCreateRequest {
  store: Store,
  settings: Settings,
}
