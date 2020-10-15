import * as Knex from 'knex';

export const up = async (knex: Knex): Promise<any> => {
  return Promise.all([
    knex.schema.createTable('user', function(table) {
      table.string('id').notNullable().unique().primary()
      table.specificType('created_at', 'timestamp default now()')
      table.string('email').unique().notNullable()
      table.string('fullname')
      table.string('hashed_password').notNullable()
      table.json('meta')
    })
  ])
}

export const down = (knex: Knex): Promise<any> => {
  return Promise.all([
    knex.schema.dropTable('user')
  ])
}