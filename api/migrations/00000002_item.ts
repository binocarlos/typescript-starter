import * as Knex from 'knex';

export const up = async (knex: Knex): Promise<any> => {
  return Promise.all([
    knex.schema.createTable('item', function(table) {
      table.string('id').notNullable().unique().primary()
      table.specificType('created_at', 'timestamp default now()')
      table.string('name').notNullable()
      table.json('meta')
    })
  ])
}

export const down = (knex: Knex): Promise<any> => {
  return Promise.all([
    knex.schema.dropTable('item')
  ])
}
