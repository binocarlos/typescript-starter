import userUtils from '../utils/user'

import {
  ItemRecord,
} from 'typescript-starter-types/src/database_records'

import {
  ItemController,
  ItemQuery,
  ItemQuerySearch,
  ItemRecordCore,
  ItemRecordUpdate,
} from 'typescript-starter-types/src/item'

import {
  ControllerCreateRequest,
} from '../types/controller'

const ItemControllerFactory = ({
  store,
}: ControllerCreateRequest): ItemController => {

  const list = (query: ItemQuerySearch): Promise<ItemRecord[]> => 
    store.item.list(query)

  const get = (query: ItemQuery): Promise<ItemRecord> =>
    store.item.get(query)
  
  const create = async (data: ItemRecordCore): Promise<ItemRecord> =>
    store.item.create(data)

  const update = (query: ItemQuery, data: ItemRecordUpdate): Promise<ItemRecord> =>
    store.item.update(query, data)

  const del = (query: ItemQuery): Promise<ItemRecord> =>
    store.item.delete(query)

  const updateMeta = async (query: ItemQuery, data: Record<string, any>): Promise<ItemRecord> =>
    store.item.updateMeta(query, data)

  return {
    list,
    get,
    create,
    update,
    delete: del,
    updateMeta,
  }
}

export default ItemControllerFactory