import {
  Request,
} from 'express'

import {
  Controller,
} from './controller'

import {
  UserRecord,
} from 'typescript-starter-types/src/database_records'

export interface RouteCreateRequest {
  controllers: Controller,
}

export interface AnnotatedRequest extends Request {
  user?: UserRecord,
}
