import React, { FC } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import icons from '../../icons'

import {
  ColorName,
  ColorNameIcon,
  ColorNameTypography,
} from '../../types/app'

const ErrorIcon = icons.error

const useStyles = makeStyles(theme => createStyles({
  root: {
    textAlign: 'center',
  },
}))

interface ErrorProps {
  color?: ColorName,
  message?: string,
}

const Error: FC<ErrorProps> = ({
  color = 'error',
  message = 'error',
}) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <ErrorIcon 
        color={ color as ColorNameIcon }
      />
      { 
        message && (
          <Typography
            variant='subtitle1'
            color={ color as ColorNameTypography }
          >
            { message }
          </Typography>
        )
      }
    </div>
  )
}

export default Error