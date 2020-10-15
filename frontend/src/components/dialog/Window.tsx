import React, { useCallback, ReactNode, FC } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => {
  return {
    paper: {
      backgroundColor: '#fff',
    },
    fullHeightPaper: {
      height: '100%',
    },
    buttonsContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
    },
    button: {
      marginLeft: theme.spacing(2),
    },
    buttonsLeft: {
      flexGrow: 0,
    },
    buttonsRight: {
      flexGrow: 1,
      textAlign: 'right',
    },
    compactContent: {
      padding: '0px!important' as any,
    },
    noWindowScroll: {
      overflowX: 'hidden!important' as any,
      overflowY: 'hidden!important' as any,
    },
    header: {
      padding: theme.spacing(1),
    }
  }
})   

interface WindowProps {
  leftButtons?: ReactNode,
  rightButtons?: ReactNode,
  buttons?: ReactNode,
  withCancel?: boolean,
  loading?: boolean,
  submitTitle?: string,
  cancelTitle?: string,
  open: boolean,
  title?: string,
  size?: DialogProps["maxWidth"],
  compact?: boolean,
  noScroll?: boolean,
  fullHeight?: boolean,
  noActions?: boolean,
  onCancel: {
    (): void,
  },
  onSubmit: {
    (): void,
  },
  theme?: Record<string, string>,
  disabled?: boolean,
}

const Window: FC<WindowProps> = ({
  leftButtons,
  rightButtons,
  buttons,
  withCancel,
  loading = false,
  submitTitle = 'Save',
  cancelTitle = 'Cancel',
  open,
  title,
  size = 'md',
  children,
  compact = false,
  noScroll = false,
  fullHeight = false,
  noActions = false,
  onCancel,
  onSubmit,
  theme = {},
  disabled = false,
}) => {
  const classes = useStyles()

  const closeWindow = useCallback(() => {
    onCancel && onCancel()
  }, [
    onCancel,
  ])

  const headerClassname = classnames(classes.header, theme.header)
    
  const contentClassname = classnames({
    [classes.compactContent]: compact,
    [classes.noWindowScroll]: noScroll,
  }, theme.content)

  const paperClassname = classnames({
    [classes.fullHeightPaper]: fullHeight,
    [classes.noWindowScroll]: noScroll,
  }, classes.paper, theme.paper)
  
  return (
    <Dialog
      open={ open }
      onClose={ closeWindow }
      fullWidth
      maxWidth={ size }
      classes={{
        paper: paperClassname,
      }}
    >
      {
        title && (
          <DialogTitle
            className={ headerClassname }
          >
            { title }
          </DialogTitle>
        )
      }
      <DialogContent
        className={ contentClassname }
      >
        { children }
      </DialogContent>
      {
        !noActions && (
          <DialogActions>
            <div className={ classes.buttonsContainer }>
              <div className={ classes.buttonsLeft }>
                { leftButtons }
              </div>
              <div className={ classes.buttonsRight }>
                {
                  withCancel && (
                    <Button
                      className={ classes.button }
                      type="button"
                      variant="contained"
                      onClick={ closeWindow }
                    >
                      { cancelTitle }
                    </Button>
                  )
                }
                {
                  onSubmit && (
                    <Button
                      className={ classes.button }
                      type="button"
                      variant="contained"
                      color="primary"
                      disabled={ disabled || loading ? true : false }
                      onClick={ onSubmit }
                    >
                      { submitTitle }
                    </Button>
                  )
                }
                { rightButtons || buttons }
              </div>
            </div>
          </DialogActions>
        )
      }
    </Dialog>
  )
}

export default Window