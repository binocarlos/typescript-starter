import {
  AxiosInstance,
} from 'axios'

import {
  UserRecord,
} from 'typescript-starter-types/src/database_records'

import {
  UserToken,
} from 'typescript-starter-types/src/user'

export interface UserWithApi extends UserRecord {
  token: UserToken,
  axios: AxiosInstance,
}