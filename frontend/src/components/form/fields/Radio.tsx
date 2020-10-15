import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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

const RadioField: FC<FormFieldProps> = (props) => {

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
      <RadioGroup
        aria-label={ title }
        name={ name }
        value={ value }
        onChange={ onChange }
        row={ item.meta && item.meta.row ? true : false }
      >
        {
          (item.options || []).map((option, i) => {
            option = typeof(option) === 'string' ? {
              title: option,
              value: option,
            } : option

            return (
              <FormControlLabel
                key={ i }
                value={ option.value }
                label={ option.title }
                disabled={ disabled }
                control={<Radio />}
              />
            )
          })
        }
      </RadioGroup>
      <HelperText
        helperText={ item.helperText }
        error={ error ? true : false }
        touched={ touched }
      />
    </FormControl>
  )
}

export default RadioField