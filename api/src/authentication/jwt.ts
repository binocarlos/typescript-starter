import {
  Request,
  Response,
  NextFunction,
} from 'express'

import {
  ExtractJwt,
} from 'passport-jwt'

import {
  verifyToken,
} from '../utils/user'

import {
  RouteCreateRequest,
  AnnotatedRequest,
} from '../types/route'

const JWTAuthentication = ({
  controllers,
}: RouteCreateRequest) => {

  const tokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken()
  return async function jwtAuth(req: AnnotatedRequest, res: Response, next: NextFunction) {
    try {
      const token = tokenExtractor(req)
      if(!token) return next()
      const payload = await verifyToken(token)
      if(!payload || !payload.id) return next()
      const user = await controllers.user.get({
        id: payload.id,
      })
      if(!user) return next()
      req.user = user
      next()
    } catch(e) {
      return next()
    }
  }
}

export default JWTAuthentication