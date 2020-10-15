import {
  AppRoute,
} from '../types/router'

/*

  given a route structure with children e.g.

  [
    {
      name: 'home',
      path: '/'
    },
    {
      name: 'login',
      path: '/login',
      apples: 10,
      children: [
        {
          name: 'test',
          path: '/test',
          oranges: 11,
        },
      ],
    },
  ]

  this will find a route based on the given name e.g.

  login.test will return:

  {
    name: 'test',
    path: '/test',
    oranges: 11,
  }

*/
export const findRoute = (routes: AppRoute[], name: string): AppRoute | undefined => {
  if(!name) return undefined
  const parts = name.split('.')

  let currentRoute: AppRoute | undefined = {
    name: '',
    path: '',
    children: routes,
  }

  parts.forEach(part => {
    if(!currentRoute || !currentRoute.children) return null
    currentRoute = currentRoute.children.find(route => route.name == part)
  })

  return currentRoute
}

export const findRoutes = (routes: AppRoute[], names: string[]): AppRoute[] => {
  const results: AppRoute[] = []
  names.forEach(name => {
    const match = findRoute(routes, name)
    if(match !== undefined) {
      results.push(match)
    }
  })
  return results
}