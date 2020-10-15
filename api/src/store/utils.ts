import Knex from 'knex'
import { getRandomId } from '../utils/id'

export const getId = async ({
  knex,
  table,
}: {
  knex: Knex,
  table: string,
}): Promise<string> => {
  let ok: boolean = false
  let id: string = `${table}_${getRandomId()}`
  while(!ok) {
    const record: object = await knex
      .select('id')
      .from(table)
      .where({id})
      .first()

    if(record) {
      id = `${table}_${getRandomId()}`
    }
    else {
      ok = true
    }
  }
  return id
}

export default {
  getId,
}