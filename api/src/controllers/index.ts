import User from './user'
import Item from './item'
import Storage from './storage'

import {
  Controller,
  ControllerCreateRequest,
} from '../types/controller'

const Controllers = (query: ControllerCreateRequest): Controller => {

  if(!query.settings) throw new Error(`settings are required for new controllers`)
  
  const storage = Storage()
  const user = User(query)
  const item = Item(query)

  return {
    storage,
    user,
    item,
  }
}

export default Controllers