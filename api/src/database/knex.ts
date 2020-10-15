import Knex from 'knex'

import {
  PostgresSettings,
} from '../types/system'

const KnexFactory = (options: PostgresSettings): any => Knex(options)
export default KnexFactory