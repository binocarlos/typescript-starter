import User from './user'
import Item from './item'

import {
  Store,
  StoreCreateRequest,
  TransactionHandler,
} from '../types/store'

const StoreFactory = ({
  knex,
}: StoreCreateRequest): Store => {

  const getHandlers = ({
    knex,
  }: StoreCreateRequest): Store  => {

    const user = User({
      knex,
    })

    const item = Item({
      knex,
    })
  
    return {
      knex,
      user,
      item,
    }
  }

  const baseHandlers = getHandlers({knex})

  function transaction<QUERY, RES>(handler: TransactionHandler<QUERY, RES>): (query: QUERY) => Promise<RES> {
    return function transactionHandler(query: QUERY): Promise<RES> {
      return knex.transaction(async trx => {
        const store = getHandlers({
          knex: trx,
        })
        return handler(store, query)
      })
    }
  }

  baseHandlers.transaction = transaction

  return baseHandlers
}

export default StoreFactory