import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import SideMenu from '../components/layout/SideMenu'

import Snackbar from '../components/system/Snackbar'
import GlobalLoading from '../components/system/GlobalLoading'

import networkSelectors from '../store/selectors/network'
import systemSelectors from '../store/selectors/system'

import {
  TOPBAR_HEIGHT,
  APP_TITLE,
  APP_LOGO,
} from '../settings'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    fontFamily: 'Roboto',
  },
  appbar: {
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
    flex: 1,
    height: `${TOPBAR_HEIGHT}px`,
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: '0px',
    backgroundColor: '#FFFFFF',
    height: '100%'
  },
  flex: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  contentContainer: {
    paddingTop: `${TOPBAR_HEIGHT}px`,
    height: `calc(100% - ${TOPBAR_HEIGHT}px)`,
  },
  content: {
    marginTop: theme.spacing(4),
  },
  logo: {
    marginLeft: theme.spacing(2),
    height: '50px',
  }
}))

const Layout: FC = ({
  children,
}) => {
  const classes = useStyles()

  const globalLoading = useSelector(networkSelectors.globalLoading)
  const menu = useSelector(systemSelectors.mainMenu)

  return (
    <div className={ classes.root }>
      <AppBar className={ classes.appbar }>
        <Toolbar className={ classes.toolbar }>
          <SideMenu 
            items={ menu }
          />
          <Box p={2}>
            <img src={ APP_LOGO } className={ classes.logo } />
          </Box>
          <div className={ classes.flex }>
            <Typography 
              variant="h6" 
              color="primary" 
            >
              { APP_TITLE }
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" className={ classes.contentContainer }>
        <div className={ classes.content }>
          { children }
        </div>
      </Container>
      <GlobalLoading { ...globalLoading } />
      <Snackbar />
    </div>
  )
}

export default Layout