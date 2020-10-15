import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'

import HelperText from './HelperText'
import { getProps } from './utils'

import {
  FormFieldProps,
} from '../../../types/form'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    //marginTop: theme.spacing(2),
  },
}))

const SelectField: FC<FormFieldProps> = (props) => {
  const {
    field: {
      name,
      value,
      onChange,
    },
    disabled,
    error,
    touched,
    item,
  } = getProps(props)
  const classes = useStyles()
  const title = item.title || name

  return (
    <FormControl component="fieldset" className={ classes.root } disabled={ disabled }>
      <InputLabel htmlFor={ name }>{ title }</InputLabel>
      <Select
        value={ value || '' }
        onChange={ onChange }
        inputProps={{
          name,
          id: name,
        }}
      >
        {
          (item.options || []).map((option, i) => {
            option = typeof(option) === 'string' ? {
              title: option,
              value: option,
            } : option

            return (
              <MenuItem
                key={ i }
                value={ option.value }
              >
                { option.title }
              </MenuItem>
            )
          })
        }
      </Select>
      <HelperText
        helperText={ item.helperText }
        error={ error ? true : false }
        touched={ touched }
      />
    </FormControl>
  )
}

export default SelectField