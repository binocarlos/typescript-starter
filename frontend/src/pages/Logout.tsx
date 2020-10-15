import React, { useEffect, FC } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import authActions from '../store/modules/auth'

const useStyles = makeStyles(theme => ({
  root: {
    
  },
}))

const Logout: FC = ({

}) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(authActions.logout())
  }, [])

  return (
    <div className={ classes.root }>
      Logging out...
    </div>
  )
}

export default Logout