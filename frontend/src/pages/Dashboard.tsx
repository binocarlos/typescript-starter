import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

import Link from '../components/widgets/Link'

import icons from '../icons'
import systemSelectors from '../store/selectors/system'

import {
  MenuItem,
} from '../types/app'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    textAlign: 'center',
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
}))

const Dashboard: FC = ({

}) => {

  const classes = useStyles()
  const menu = useSelector(systemSelectors.dashboardMenu)

  return (
    <div className={ classes.root }>
      <Paper className={ classes.paper }>
        <Typography color="primary" align="center" gutterBottom variant="h4" className={ classes.header }>
          Dashboard
        </Typography>
        <Grid
          container
          spacing={ 2 }
          justify="center"
          alignItems="center"
        >
          {
            menu.map((item: MenuItem, i) => {
              const Icon = icons[item.icon as string]
              return (
                <Grid key={ i } item xs={ 6 } sm={ 4 } md={ 3 }>
                  <div className={ classes.gridItem }>
                    <Link className={ classes.link } name={ item.link as string } params={ item.params }>
                      <Icon color="primary" style={{ fontSize: 80 }} />
                      <Box color="primary" fontSize={24} textAlign="center">{ item.title }</Box>
                    </Link>
                  </div>
                </Grid>
              )
            })
          }
        </Grid>

      </Paper>
    </div>
  )
}

export default Dashboard