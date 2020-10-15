import React, { FC } from 'react'
import TextField from './Text'

import {
  FormFieldProps,
} from '../../../types/form'

const TextArea: FC<FormFieldProps> = (props) => {
  const item = props.item

  const inputProps = Object.assign({}, item.inputProps, {
    multiline: true,
    rows: item.meta && item.meta.rows ? item.meta.rows : 3,
  })

  const useItem = Object.assign({}, item, {
    inputProps,
  })

  const useProps = Object.assign({}, props, {
    item: useItem,
  })

  return (
    <TextField
      { ...useProps }
    />
  )
}

export default TextArea