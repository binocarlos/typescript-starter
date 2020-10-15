import React, { FC } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Loading from './Loading'
import Error from './Error'

import {
  GlobalLoadingProps,
} from '../../types/app'

interface StyleProps {
  transparent: boolean,
}

const useStyles = makeStyles(theme => createStyles({
  container: ({transparent}: StyleProps) => ({
    position: 'fixed',
    left: '0px',
    top: '0px',
    zIndex: 10000,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent ?
      'rgba(255, 255, 255, 0.7)' :
      'rgba(255, 255, 255, 1)'
  }),
  loadingContainer: {
    padding: theme.spacing(6),
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5e5',
    //boxShadow: '5px 5px 5px 0px rgba(0,0,0,0.2)',
    //borderRadius: 20,
  },
  logs: {
    color: '#999'
  }
}))

const GlobalLoading: FC<GlobalLoadingProps> = ({
  active,
  transparent = true,
  message = 'loading...',
  error,
  logs = [],
}) => {
  const classes = useStyles({transparent})
  if(!active) return null
  return (
    <div className={ classes.container }>
      <div className={ classes.loadingContainer }>
        {
          error ? (
            <Error
              message={ error }
            />
          ) : (
            <Loading
              message={ message }
            >
              {
                logs.map((log, i) => {
                  return (
                    <Typography
                      variant="body2"
                      key={ i }
                      className={ classes.logs }
                    >
                      { log }
                    </Typography>
                  )
                })
              }
            </Loading>
          )
        }
      </div>
    </div>
  )
}

export default GlobalLoading