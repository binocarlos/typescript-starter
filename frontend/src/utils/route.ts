export const routePathToName = (path: string): string => {
  const name = path
    .replace(/^\//, '')
    .replace(/\//g, '-')
  return name || 'root'
}

export const sanitizeRoute = (path: string): string => path.replace(/\/+/g, '/')

export default {
  routePathToName,
  sanitizeRoute,
}
