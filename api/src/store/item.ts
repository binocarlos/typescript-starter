import utils from './utils'

import {
  ItemRecord,
} from 'typescript-starter-types/src/database_records'

import {
  ItemStore,
  ItemQuery,
  ItemQuerySearch,
  ItemRecordCore,
  ItemRecordUpdate,
} from 'typescript-starter-types/src/item'

import {
  StoreCreateRequest,
} from '../types/store'

const SEARCH_FIELDS = [
  'name',
]

const ItemStore = ({
  knex,
}: StoreCreateRequest): ItemStore => {
 
  const list = (query: ItemQuerySearch): Promise<ItemRecord[]> => {
    const knexQuery = knex
      .select()
      .from('item')
    if(knexQuery.search) {
      const sql = SEARCH_FIELDS.map(f => `${f} ILIKE ?`).join(' or ')
      const sqlparams = SEARCH_FIELDS.map(f => `%${query.search}%`)
      knexQuery.whereRaw(sql, sqlparams)
    }
    return knexQuery
  }

  const get = (query: ItemQuery): Promise<ItemRecord> => {
    if(!query.id) throw new Error(`id or email required for item.get`)
    return knex('item')
      .where({
        id: query.id,
      })
      .first()
  }

  const create = async (data: ItemRecordCore): Promise<ItemRecord> => {
    const id = await utils.getId({
      knex,
      table: 'item',
    })
    return knex('item')
      .insert({
        id,
        ...data
      })
      .returning('*')
      .get(0)
  }

  const update = (query: ItemQuery, data: ItemRecordUpdate): Promise<ItemRecord> => 
    knex('item')
      .where(query)
      .update(data)
      .returning('*')
      .get(0)

  const del = (query: ItemQuery): Promise<ItemRecord> => 
    knex('item')
      .where(query)
      .del()
      .returning('*')
      .get(0)

  const updateMeta = async (query: ItemQuery, data: Record<string, any>): Promise<ItemRecord> => {
    const item = await get(query)
    if(!item) throw new Error(`no user found`)
    const meta = Object.assign({}, item.meta, data)
    return knex('item')
      .where({id: item.id})
      .update({
        meta,
      })
      .returning('*')
      .get(0)
  }

  return {
    list,
    get,
    create,
    update,
    delete: del,
    updateMeta,
  }
}

export default ItemStore
