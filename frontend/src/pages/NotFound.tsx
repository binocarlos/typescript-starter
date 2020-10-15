import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    
  },
}))

const NotFound: FC = ({

}) => {
  const classes = useStyles()

  return (
    <div className={ classes.root }>
      Not found
    </div>
  )
}

export default NotFound