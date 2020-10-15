import React, { FC } from 'react'
import TextField from '@material-ui/core/TextField'

import { getProps } from './utils'

import {
  FormFieldProps,
} from '../../../types/form'

const Text: FC<FormFieldProps> = (props) => {
  const {
    field: {
      name,
      value,
      onChange,
      onBlur
    },
    disabled,
    error,
    touched,
    item,
  } = getProps(props)
  const inputProps = item.inputProps || {}
  return (
    <TextField
      fullWidth
      id={ name }
      name={ name }
      label={ item.title || item.id }
      helperText={ touched && error ? error : item.helperText }
      error={ touched && Boolean(error) }
      value={ value || '' }
      disabled={ disabled }
      onChange={ onChange }
      onBlur={ onBlur }
      { ...inputProps }
    />
  )
}

export default Text