import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import HelperText from './HelperText'
import { getProps } from './utils'

import {
  FormFieldProps,
} from '../../../types/form'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing(2),
  },
}))

const CheckboxField: FC<FormFieldProps> = (props) => {
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
      <FormLabel component="legend">{ title }</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name={ name }
              checked={ value ? true : false }
              onChange={ onChange }
              value={ name }
            />
          }
          label={ title }
        />
      </FormGroup>
      <HelperText
        helperText={ item.helperText }
        error={ error ? true : false }
        touched={ touched }
      />
    </FormControl>
  )

}

export default CheckboxField