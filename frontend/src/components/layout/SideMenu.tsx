import React, { FC } from 'react'
import NavDrawer, { NavDrawerGetChildren } from '../widgets/NavDrawer'
import MenuList from '../widgets/MenuList'

import {
  MenuItem,
} from '../../types/app'

interface SideMenuProps {
  items: MenuItem[],
}

const SideMenu: FC<SideMenuProps> = ({
  items,
}) => {

  const getChildren: NavDrawerGetChildren = (onClick) => {
    return (
      <MenuList
        items={ items }
        onClick={ onClick }
      />
    )
  }
  return (
    <NavDrawer
      getChildren={ getChildren }
    />
  )
}

export default SideMenu