import React, { useCallback, FC } from 'react'
import { useDispatch, useStore } from 'react-redux'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import routerActions from '../../store/modules/router'

import icons from '../../icons'

import {
  MenuItem,
} from '../../types/app'

interface MenuListProps {
  items: MenuItem[],
  onClick: {
    (item: MenuItem): void,
  },
}

const MenuList: FC<MenuListProps> = ({
  items,
  onClick,
}) => {
  const dispatch = useDispatch()
  const store = useStore()
  const clickItem = useCallback((item: MenuItem) => {
    if(item.link) {
      dispatch(routerActions.navigateTo(item.link, item.params || {}))
    }
    else if(item.handler) {
      item.handler(dispatch, store.getState)
    }
    if(onClick) onClick(item)
  }, [])

  return (
    <List component="nav">
      {
        items.map((item: MenuItem, i) => {
          if(item.title === '-') {
            return (
              <Divider key={ i } />
            )
          }

          const Icon = item.icon ? icons[item.icon] : null
    
          return (
            <ListItem 
              button 
              key={ i }
              onClick={ () => clickItem(item) }
            >
              {
                Icon && (
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                )
              }
              <ListItemText 
                primary={ item.title }
              />
            </ListItem>
          )
        })
      }
    </List>
  )
}

export default MenuList