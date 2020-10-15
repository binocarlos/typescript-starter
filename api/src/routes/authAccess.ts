import Pino from 'pino'

import {
  Response,
  NextFunction,
} from 'express'

import {
  RouteCreateRequest,
  AnnotatedRequest,
} from '../types/route'

const pino = Pino({
  name: 'authAccess',
})

const AuthAccess = ({
  controllers,
}: RouteCreateRequest) => {

  const loggedIn = (req: AnnotatedRequest, res: Response, next: NextFunction) => {
    if(req.user) return next()
    res.status(401)
    res.json({
      error: 'access denied',
    })
  }

  const admin = (req: AnnotatedRequest, res: Response, next: NextFunction) => {
    if(req.user && req.user.meta.admin === true) return next()
    res.status(401)
    res.json({
      error: 'access denied',
    })
  }

  return {
    loggedIn,
    admin,
  }
}

export default AuthAccess