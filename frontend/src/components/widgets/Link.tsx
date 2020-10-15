import React, { useCallback, useMemo, FC, MouseEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import utils from '../../utils/route'

import routerActions from '../../store/modules/router'
import routerSelectors from '../../store/selectors/router'
/*

  render a link to one of:

   * external url
   * internal name
   * internal path
   
   if the "url" is given - we treat it like a normal link tag

   if name or path is given - we hijack the click event,
   resolve the link and trigger the router action

   if an onClick handler is given - it is always triggered when
   the link is clicked regardless of the types above

*/

interface LinkProps {
  name: string,
  path?: string,
  url?: string,
  params?: Record<string, any>,
  onClick?: {
    (e: MouseEvent): void,
  },
  // this is the "...other" props
  [other: string]: any,
}

const Link: FC<LinkProps> = ({
  path,
  name,
  url,
  params,
  children,
  onClick,
  ...other
}) => {
  const routeMap = useSelector(routerSelectors.routeNameMap)
  const dispatch = useDispatch()
  const openPage = useCallback((e: MouseEvent) => {
    if(url) {
      if(onClick) onClick(e)
      return true
    }
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    let routeName = name
    if(!routeName && path) {
      routeName = utils.routePathToName(path)
    }
    if(!routeName) {
      return
    }
    dispatch(routerActions.navigateTo(routeName, params))
    if(onClick) onClick(e)
    return false
  }, [
    path,
    name,
    url,
  ])
  const href = useMemo(() => {
    if(url) return url
    if(path) return path
    const route = routeMap[name]
    return route ? route.path : null
  }, [
    name,
    path,
    url,
    routeMap,
  ])
  if(!href) {
    return (
      <span style={{color:'red'}}>
        route not found: name={ name }, path={ path }
      </span>
    )
  }
  return (
    <a
      href={ href }
      target={ url ? '_blank' : '_self' }
      onClick={ openPage }
      {...other}
    >
      { children }
    </a>
  )
}

export default Link