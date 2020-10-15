import React, { useCallback, FC } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import MenuButton from '../widgets/MenuButton'
import icons from '../../icons'

import {
  MenuButtonItem,
} from '../../types/app'

const MoreVertIcon = icons.moreVert

const useStyles = makeStyles(theme => {
  return {
    icon: {
      color: '#ff0000',
      backgroundColor: '#ff0000',
    },
  }
})

interface AppBarMenuProps {
  items: MenuButtonItem[],
  theme: Record<string, string>,
}

const AppBarMenu: FC<AppBarMenuProps> = ({
  items,
  theme = {},
}) => {
  const classes = useStyles()
  const iconClassname = classnames(classes.icon, theme.icon)
  const getButton = useCallback((onClick) => {
    return (
      <Button
        onClick={ onClick }
      >
        <MoreVertIcon
          className={ iconClassname }
        />
      </Button>
    )
  }, [
    iconClassname,
  ])

  const getItems = useCallback(() => items, [items])

  return (
    <MenuButton
      getButton={ getButton }
      getItems={ getItems }
    />
  )
}

export default AppBarMenu