import { ComponentType } from 'react'
import fields, { defaultValues, ComponentName } from './fields'
import nestedProperty from 'nested-property'

import {
  FormSchema,
  FormSchemaField,
} from '../../types/form'

export const flattenSchema = (schema: FormSchema) => {
  return schema.reduce<FormSchemaField[]>((all, row) => {
    return row.constructor === Array ?
      all.concat(row) :
      all.concat([row as FormSchemaField])
  }, [])
}

export const getComponent = (component: ComponentName | ComponentType) => {
  let Component = typeof(component) === 'string' ?
      fields[component] :
      component

  if(!Component) Component = fields.text

  return Component
}

export const getInitialValues = (schema: FormSchema, initialValues: any) => {
  const flatSchema = flattenSchema(schema)
  return flatSchema.reduce((all, field) => {
    if(field.divider) return all
    const existing = nestedProperty.get(all, field.id)
    const component = field.component || 'text'
    if(!existing && typeof(component) === 'string') {
      nestedProperty.set(all, field.id, defaultValues[component as ComponentName])
    }
    return all
  }, Object.assign({}, initialValues))
}

export default {
  flattenSchema,
  getComponent,
  getInitialValues,
}