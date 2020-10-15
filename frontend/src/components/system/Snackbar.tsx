import React, { useCallback, FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import {
  OverridableComponent
} from '@material-ui/core/OverridableComponent'
import {
  SvgIconTypeMap
} from '@material-ui/core/SvgIcon'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import IconButton from '@material-ui/core/IconButton'

import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'

import CloseIcon from '@material-ui/icons/Close'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import WarningIcon from '@material-ui/icons/Warning'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'

import snackbarActions from '../../store/modules/snackbar'
import snackbarSelectors from '../../store/selectors/snackbar'

const variantIcon: {
  [name: string]: OverridableComponent<SvgIconTypeMap>,
} = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

type ClassnameKey = 'icon' | 'iconVariant' | 'message' | 'close' | 'success' | 'warning' | 'error' | 'info' | 'margin'

const useStyles = makeStyles(theme => ({
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  close: {
    padding: theme.spacing(0.5),
  },
  success: {
    backgroundColor: green[600],
  },
  warning: {
    backgroundColor: amber[700],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  margin: {
    margin: theme.spacing(1),
  },
}))

const SnackbarWrapper: FC = ({

}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const {
    open = false,
    text = '',
    type = 'default'
  } = useSelector(snackbarSelectors.data)

  const onClose = useCallback(() => {
    dispatch(snackbarActions.onClose())
  }, [])
  
  const Icon = variantIcon[type]

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={ open }
        autoHideDuration={ 5000 }
        disableWindowBlurListener={ true }
        onClose={ onClose }
      >
        <SnackbarContent
          className={ classNames(classes[type as ClassnameKey], classes.margin) }
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={ classes.message }>
              { 
                Icon && (
                  <Icon 
                    className={ classNames(classes.icon, classes.iconVariant) }
                  />
                )
              }
              { text }
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={ classes.close }
              onClick={ onClose }
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    </div>
  )
}

export default SnackbarWrapper