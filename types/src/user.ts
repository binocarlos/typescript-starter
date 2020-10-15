import {
  Omit,
} from 'utility-types'

import {
  AugmentedDatabaseFields,
} from './utils'

import {
  UserRecord,
} from './database_records'

/*

  api interface

*/
export interface UserStore {
  list(query: UserQuerySearch): Promise<UserRecord[]>
  get(query: UserQuery): Promise<UserRecord>
  create(data: UserRecordCore): Promise<UserRecord>
  update(query: UserQuery, data: UserRecordUpdate): Promise<UserRecord>
  delete(query: UserQuery): Promise<UserRecord>
  updateMeta(query: UserQuery, data: Record<string, any>): Promise<UserRecord>
}

export interface UserController {
  login(query: UserQueryLogin): Promise<UserToken>
  register(query: UserQueryRegister): Promise<UserToken>
  getToken(query: UserQueryId): Promise<UserToken>
  list(query: UserQuerySearch): Promise<UserRecord[]>
  get(query: UserQuery): Promise<UserRecord>
  update(query: UserQuery, data: UserRecordUpdate): Promise<UserRecord>
  delete(query: UserQuery): Promise<UserRecord>
  updateMeta(query: UserQuery, data: Record<string, any>): Promise<UserRecord>
  updatePassword(query: UserQueryId, data: UserQueryUpdatePassword): Promise<UserRecord>
}

/*

  utility types

*/
export type UserRecordCore = Omit<UserRecord, AugmentedDatabaseFields>
export type UserRecordUpdate = Partial<UserRecordCore>

/*

  queries

*/
export interface UserQuery {
  id?: string,
  email?: string,
}

export interface UserQueryId {
  id: string,
}

export interface UserQuerySearch {
  search?: string,
}

export interface UserQueryLogin {
  username: string,
  password: string, 
}

export interface UserQueryRegister extends UserQueryLogin {}

export interface UserQueryUpdatePassword {
  password: string,
  confirm_password: string,
}

export interface UserToken {
  token: string,
}

export interface UserTokenPayload {
  id: string,
}