import userUtils from '../utils/user'

import {
  UserRecord,
} from 'typescript-starter-types/src/database_records'

import {
  UserController,
  UserQuery,
  UserQueryUpdatePassword,
  UserQueryLogin,
  UserQueryRegister,
  UserQuerySearch,
  UserQueryId,
  UserToken,
  UserRecordUpdate,
} from 'typescript-starter-types/src/user'

import {
  ControllerCreateRequest,
} from '../types/controller'

const UserControllerFactory = ({
  store,
}: ControllerCreateRequest): UserController => {

  const login = async (query: UserQueryLogin): Promise<UserToken> => {
    if(!query.username || !query.password) return null
    const user = await store.user.get({
      email: query.username,
    })
    if(!user) return null
    const correct = await userUtils.checkPassword(query.password, user.hashed_password)
    if(!correct) return null
    return userUtils.getToken(user.id)
  }

  const register = async (query: UserQueryRegister): Promise<UserToken> => {
    if(!query.username || !query.password) return null
    const existingUser = await store.user.get({
      email: query.username,
    })
    if(existingUser) throw new Error(`user with that email already exists ${query.username}`)
    const hashed_password = await userUtils.hashPassword(query.password)
    const user = await store.user.create({
      email: query.username,
      hashed_password,
    })
    return userUtils.getToken(user.id)
  }

  const getToken = async (query: UserQueryId): Promise<UserToken> => {
    if(!query.id) throw new Error(`userid required for getToken`)
    return userUtils.getToken(query.id)
  }
  
  const list = (query: UserQuerySearch): Promise<UserRecord[]> => 
    store.user.list(query)
      .then(users => users.map(userUtils.safeUser))
  
  const get = (query: UserQuery): Promise<UserRecord> => 
    store.user.get(query)
      .then(user => userUtils.safeUser(user))

  const update = (query: UserQuery, data: UserRecordUpdate): Promise<UserRecord> => 
    store.user.update(query, data)
      .then(user => userUtils.safeUser(user))

  const del = (query: UserQuery): Promise<UserRecord> => 
    store.user.delete(query)
      .then(user => userUtils.safeUser(user))
    
  const updateMeta = (query: UserQuery, data: Record<string, any>): Promise<UserRecord> => 
    store.user.updateMeta(query, data)
      .then(user => userUtils.safeUser(user))

  const updatePassword = async (query: UserQueryId, data: UserQueryUpdatePassword): Promise<UserRecord> => {
    if(data.password != data.confirm_password) throw new Error(`the two passwords must match`)
    const hashed_password = await userUtils.hashPassword(data.password)
    const existingUser = await store.user.get(query)
    if(!existingUser) throw new Error(`no user found`)
    existingUser.hashed_password = hashed_password
    const user = await store.user.update(query, existingUser)
    return user
  }

  return {
    login,
    register,
    getToken,
    list,
    get,
    update,
    delete: del,
    updateMeta,
    updatePassword,
  }
}

export default UserControllerFactory