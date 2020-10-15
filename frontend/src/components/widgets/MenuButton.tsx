import React, { useMemo, FC, MouseEvent, ReactNode } from 'react'
import withMenuButton, { WithMenuButtonProps } from '../hooks/withMenuButton'

interface MenuButtonProps extends WithMenuButtonProps {
  className?: string,
  getButton: (onClick: (e: MouseEvent) => void) => ReactNode,
}

const MenuButton: FC<MenuButtonProps> = ({
  // the classname for the root item
  className,
  // a function that is called (onClick) to render the button
  getButton,
  ...other
}) => {

  const {
    menus,
    onClick,
  } = withMenuButton(other)
  
  const button = useMemo(
    () => getButton(onClick),
    [
      getButton,
      onClick,
    ]
  )

  return (
    <div className={ className }>
      { button }
      { menus }
    </div>
  )
}

export default MenuButton