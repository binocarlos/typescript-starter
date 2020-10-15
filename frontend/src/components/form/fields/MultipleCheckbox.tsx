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

const MultipleCheckboxField: FC<FormFieldProps> = (props) => {

  const {
    field: {
      name,
      value,
    },
    form: {
      setFieldValue,
    },
    disabled,
    error,
    touched,
    item,
  } = getProps(props)
  
  const classes = useStyles()

  const title = item.title || name
  const useValue = value || {}

  return (
    <FormControl component="fieldset" className={ classes.root } disabled={ disabled }>
      <FormLabel component="legend">{ title }</FormLabel>
      <FormGroup
        row={ item.meta && item.meta.row ? true : false }
      >
        {
          (item.options || []).map((option, i) => {
            option = typeof(option) === 'string' ? {
              title: option,
              value: option,
            } : option

            const checked = useValue[option.value] ? true : false

            return (
              <FormControlLabel
                key={ i }
                control={
                  <Checkbox
                    name={ `${name}-${i}` }
                    checked={ checked }
                    onChange={ () => {
                      const newValue = Object.assign({}, useValue)
                      if(!checked) {
                        newValue[option.value] = true
                      }
                      else {
                        delete(newValue[option.value])
                      }
                      setFieldValue(name, newValue)
                    }}
                    value={ `${name}-${i}` }
                  />
                }
                label={ option.title }
              />
            )
          })
        }
      </FormGroup>
      <HelperText
        helperText={ item.helperText }
        error={ error ? true : false }
        touched={ touched }
      />
    </FormControl>
  )
}

export default MultipleCheckboxField