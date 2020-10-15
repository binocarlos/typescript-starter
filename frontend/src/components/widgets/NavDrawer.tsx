import React, { useState, FC, ReactNode, ComponentType } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import Fab from '@material-ui/core/Fab'
import Drawer, { DrawerProps } from '@material-ui/core/Drawer'

import {
  MenuItem,
} from '../../types/app'

import icons from '../../icons'

const useStyles = makeStyles(theme => {
  return {
    drawer: {
      height: '100%',
      borderRight: '1px solid rgba(0, 0, 0, 0.12)',
      backgroundColor: theme.palette.background.paper,
      width: `240px`,
      minWidth: `240px`,
    },
    icon: {
      //color: theme.palette.primary.contrastText,
    },
    menuButton: {
      //backgroundColor: theme.palette.primary.main,
      // '& hover' : {
      //   backgroundColor: theme.palette.secondary.main,  
      // },
    },
  }
})

export interface NavDrawerGetChildren {
  (onClick: (item: MenuItem) => void): ReactNode,
}

interface NavDrawerProps {
  getChildren: NavDrawerGetChildren,
  anchor?: DrawerProps["anchor"],
  Icon?: ComponentType,
  theme?: Record<string, string>,
}

const NavDrawer: FC<NavDrawerProps> = ({
  anchor,
  Icon,
  theme = {},
  getChildren,
}) => {

  const classes = useStyles()

  const [drawerOpen, setDrawerOpen] = useState(false)
  
  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)

  const navbarClassname = classnames(classes.drawer, theme.drawer)
  const iconClassname = classnames(classes.icon, theme.icon)

  const UseIcon = Icon || icons.menu

  return (
    <React.Fragment>
      <Fab 
        size="small"
        color="primary"
        onClick={ openDrawer }
        className={ classes.menuButton }
      >
        <UseIcon
          className={ iconClassname }
          color="inherit" 
        />
      </Fab>
      <Drawer 
        open={ drawerOpen }
        anchor={ anchor }
        onClose={ closeDrawer }
      >
        <div className={ navbarClassname }>
          {
            getChildren(closeDrawer)
          }
        </div>
      </Drawer>
    </React.Fragment> 
  )
}

export default NavDrawer
