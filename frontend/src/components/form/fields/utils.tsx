import {
  FormHandlerProps,
  FormFieldProps,
} from '../../../types/form'

// run the incoming formik values via the handlers
// before presenting the values to the form component
export const getProps = (props: FormFieldProps): FormFieldProps => {
  const handlers = props.handlers || {}
  const newProps = Object.assign({}, props)
  const newField = Object.assign({}, props.field)
  const handlerProps: FormHandlerProps = {
    name: props.field.name,
    value: props.field.value,
    values: props.values,
  }
  newField.value = handlers.value ?
    handlers.value(handlerProps) :
    newField.value
  newProps.disabled = handlers.disabled ?
    handlers.disabled(handlerProps) :
    false
  newProps.field = newField
  return newProps
}