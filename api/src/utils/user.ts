import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import settings from '../settings'

import {
  UserToken,
  UserTokenPayload,
} from 'typescript-starter-types/src/user'

import {
  UserRecord,
} from 'typescript-starter-types/src/database_records'

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, parseInt(settings.salt_rounds))

export const checkPassword = (password: string, hashed_password: string): Promise<boolean> => bcrypt.compare(password, hashed_password)

export const getToken = (id: string): Promise<UserToken> => {
  return new Promise((resolve, reject) => {
    jwt.sign({id}, settings.jwt_secret_key, {
      expiresIn: settings.jwt_expiry,
    }, (err, token) => {
      if(err) return reject(err)
      resolve({
        token
      })
    })
  })
}

export const verifyToken = (token: string): Promise<UserTokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, settings.jwt_secret_key, (err, result) => {
      if(err) return reject(err)
      resolve(result as UserTokenPayload)
    })
  })
}

export const safeUser = (user: UserRecord): UserRecord => {
  const ret = Object.assign({}, user)
  delete(ret.hashed_password)
  return ret
}

export const isAdmin = (user: UserRecord): boolean => user.meta.admin ? true : false

export default {
  hashPassword,
  checkPassword,
  getToken,
  verifyToken,
  safeUser,
  isAdmin,
}