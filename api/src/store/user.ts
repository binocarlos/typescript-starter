import utils from './utils'

import {
  UserRecord,
} from 'typescript-starter-types/src/database_records'

import {
  UserStore,
  UserQuery,
  UserQuerySearch,
  UserRecordCore,
  UserRecordUpdate,
} from 'typescript-starter-types/src/user'

import {
  StoreCreateRequest,
} from '../types/store'

const SEARCH_FIELDS = [
  'email',
  'fullname',
]

const UserStore = ({
  knex,
}: StoreCreateRequest): UserStore => {
 
  const list = (query: UserQuerySearch): Promise<UserRecord[]> => {
    const knexQuery = knex
      .select()
      .from('user')
    if(knexQuery.search) {
      const sql = SEARCH_FIELDS.map(f => `${f} ILIKE ?`).join(' or ')
      const sqlparams = SEARCH_FIELDS.map(f => `%${query.search}%`)
      knexQuery.whereRaw(sql, sqlparams)
    }
    return knexQuery
  }

  const get = (query: UserQuery): Promise<UserRecord> => {
    if(!query.id && !query.email) throw new Error(`id or email required for auth.get`)
    return knex('user')
      .where(query)
      .first()
  }

  const create = async (data: UserRecordCore): Promise<UserRecord> => {
    const existing = await knex('user')
      .select('*')
      .where({
        email: data.email,
      })
      .first()
    if(existing) throw new Error(`there is already a user with that email: ${data.email}`)
    const id = await utils.getId({
      knex,
      table: 'user',
    })
    return knex('user')
      .insert({
        id,
        ...data
      })
      .returning('*')
      .get(0)
  }

  const update = (query: UserQuery, data: UserRecordUpdate): Promise<UserRecord> => 
    knex('user')
      .where(query)
      .update(data)
      .returning('*')
      .get(0)

  const del = (query: UserQuery): Promise<UserRecord> => 
    knex('user')
      .where(query)
      .del()
      .returning('*')
      .get(0)

  const updateMeta = async (query: UserQuery, data: Record<string, any>): Promise<UserRecord> => {
    const user = await get(query)
    if(!user) throw new Error(`no user found`)
    const meta = Object.assign({}, user.meta, data)
    return knex('user')
      .where({id: user.id})
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

export default UserStore
