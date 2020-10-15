import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Link from './Link'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    flexGrow: 1,
  },
  buttons: {
    flexGrow: 0,
  },
  link: {
    color: theme.palette.primary.main,
  },
}))

interface SectionHeaderProps {
  title: string,
}

const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  children,
}) => {
  const classes = useStyles()
  return (
    <div className={ classes.container }>
      <div className={ classes.title }>
        <Typography gutterBottom variant="h6">
          <Link
            name="home"
            path="/"
            className={ classes.link }
          >
            Dashboard
          </Link> : { title }
        </Typography>
      </div>
      <div className={ classes.buttons }>
        { children }
      </div>
    </div>
    
  )
}

export default SectionHeader