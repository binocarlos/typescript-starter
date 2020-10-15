import {
  UserStore,
} from 'typescript-starter-types/src/user'

import {
  ItemStore,
} from 'typescript-starter-types/src/item'

export interface TransactionHandler<QUERY, RES> {
  (store: Store, query: QUERY): Promise<RES>,
}

export interface Store {
  knex: any,
  user: UserStore,
  item: ItemStore,
  transaction?: <QUERY, RES>(handler: TransactionHandler<QUERY, RES>) => (query: QUERY) => Promise<RES>,
}

export interface StoreCreateRequest {
  knex: any,
}
