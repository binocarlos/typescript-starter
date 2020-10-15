import {
  Metadata,
} from './utils'

export interface UserRecord {
  id: string,
  created_at: Date,
  email: string,
  fullname?: string,
  hashed_password?: string,
  meta?: Metadata,
  system?: Metadata,
}

export interface ItemRecord {
  id: string,
  created_at: Date,
  name: string,
  meta?: Metadata,
}
