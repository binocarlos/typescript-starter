import React, { useState, useCallback, useMemo, FC, ChangeEvent } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Fab from '@material-ui/core/Fab'

import EditIcon from '@material-ui/icons/Edit'

import ColorPicker from '../../colorpicker/ColorPicker'
import colorUtils from '../../../utils/color'
import { getProps } from './utils'

import {
  FormFieldProps,
  FormColorValue,
} from '../../../types/form'

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  colorTab: {
    width: '100%',
    height: '100%',
    border: '1px solid #000',
    cursor: 'pointer',
    boxShadow: '10px 10px 20px 0px rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContent: {
    overflowX: 'hidden',
  },
}))

const ColorPickerField: FC<FormFieldProps> = (props) => {
  const {
    field: {
      name,
      value,
    },
    form: {
      setFieldValue,
    },
    item,
    error,
    touched,
  } = getProps(props)
  const classes = useStyles()
  const theme = useTheme()

  const [ open, setOpen ] = useState(false)
  const [ undoValue, setUndoValue ] = useState<FormColorValue | null>(null)

  const getCurrentValue = useCallback(() => {
    let inputValue: FormColorValue = value || {}

    if(typeof(inputValue) == 'string') inputValue = {color: inputValue}
    if(!inputValue.color) inputValue.color = theme.palette.primary.main

    const retValue = Object.assign({}, inputValue)
    if(!retValue.inputColor) retValue.inputColor = retValue.color
    return retValue
  }, [value, theme])

  const handleChangeTextField = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const inputColorString = event.currentTarget.value

    const newValues: FormColorValue = {
      inputColor: inputColorString,
    }

    if(colorUtils.isRgb(inputColorString)) {
      newValues.color = inputColorString
    }

    const currentValue = getCurrentValue()
    const updateValues = Object.assign({}, currentValue, newValues)

    setFieldValue(name, updateValues)
  }, [name, getCurrentValue, setFieldValue])

  const handleChangeColorPicker = useCallback((value: FormColorValue) => {
    setFieldValue(name, value)
  }, [name, setFieldValue])

  const handleOpen = useCallback(() => {
    setOpen(true)
    setUndoValue(getCurrentValue())
  }, [getCurrentValue])

  const handleUndo = useCallback(() => {
    setFieldValue(name, undoValue)
  }, [name, undoValue])

  const handleClose = useCallback(() => {
    setOpen(false)
    setUndoValue(null)
  }, [name, undoValue])

  const handleCancel = useCallback(() => {
    handleUndo()
    handleClose()
  }, [handleUndo, handleClose])

  const useValue = getCurrentValue()
  const description = item.helperText

  const dialog = useMemo(() => {
    if(!open) return null
    return (
      <Dialog
        open
        maxWidth="sm"
        fullWidth
        onClose={ handleClose }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{ item.title || item.id }</DialogTitle>
        <DialogContent className={ classes.dialogContent }>
          <ColorPicker
            intent='primary'
            value={ useValue }
            onUpdate={ handleChangeColorPicker }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleCancel } color="primary">
            Cancel
          </Button>
          <Button onClick={ handleClose } color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }, [])

  return (
    <div>
      { dialog }
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            aria-describedby={ name + "-helper" }
            error={ touched && error ? true : false }
          >
            <InputLabel 
              htmlFor={ name }>{ item.title || item.id }</InputLabel>
            <Input
              id={ name }
              key={ name }
              error={ touched && error ? true : false }
              value={ useValue.inputColor }
              onChange={ handleChangeTextField }
            />
            {
              touched && error ? (
                <FormHelperText id={ name + "-helper" }>
                  { error }
                </FormHelperText>
              ) : null
            }
            {
              description ? (
                <FormHelperText error={ false } id={ name + "-description" }>
                  { description }
                </FormHelperText>
              ) : null
            }
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div 
            className={ classes.colorTab } 
            style={{
              backgroundColor: value.color,
            }}
            onClick={ handleOpen }
          >
            <Fab 
              size="small" 
              aria-label="Add"
            >
              <EditIcon />
            </Fab>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default ColorPickerField