import {
  Omit,
} from 'utility-types'

import {
  AugmentedDatabaseFields,
} from './utils'

import {
  ItemRecord,
} from './database_records'

/*

  api interface

*/
export interface ItemStore {
  list(query: ItemQuerySearch): Promise<ItemRecord[]>
  get(query: ItemQuery): Promise<ItemRecord>
  create(data: ItemRecordCore): Promise<ItemRecord>
  update(query: ItemQuery, data: ItemRecordUpdate): Promise<ItemRecord>
  delete(query: ItemQuery): Promise<ItemRecord>
  updateMeta(query: ItemQuery, data: Record<string, any>): Promise<ItemRecord>
}

export interface ItemController {
  list(query: ItemQuerySearch): Promise<ItemRecord[]>
  get(query: ItemQuery): Promise<ItemRecord>
  create(data: ItemRecordCore): Promise<ItemRecord>
  update(query: ItemQuery, data: ItemRecordUpdate): Promise<ItemRecord>
  delete(query: ItemQuery): Promise<ItemRecord>
  updateMeta(query: ItemQuery, data: Record<string, any>): Promise<ItemRecord>
}

/*

  utility types

*/
export type ItemRecordCore = Omit<ItemRecord, AugmentedDatabaseFields>
export type ItemRecordUpdate = Partial<ItemRecordCore>

/*

  queries

*/
export interface ItemQuery {
  id: string,
}

export interface ItemQuerySearch {
  search?: string,
}
