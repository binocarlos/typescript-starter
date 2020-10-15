import asyncHandler from 'express-async-handler'

import {
  safeUser,
} from '../utils/user'

import {
  UserQueryLogin,
  UserQueryRegister,
  UserQueryUpdatePassword,
} from 'typescript-starter-types/src/user'

import {
  Response,
} from 'express'

import {
  RouteCreateRequest,
  AnnotatedRequest,
} from '../types/route'

const UserRoutes = ({
  controllers,
}: RouteCreateRequest) => {

  const status = async (req: AnnotatedRequest, res: Response) => {
    res.json(req.user ? safeUser(req.user) : null)
  }

  const login = async (req: AnnotatedRequest, res: Response) => {
    try {
      const result = await controllers.user.login(req.body as UserQueryLogin)
      if(result) {
        res.json(result)
      }
      else {
        res.status(401)
        res.json({
          error: `incorrect details`
        })
      }
    } catch(e) {
      res.status(401)
      res.json({
        error: e.toString()
      })
    }
  }

  const register = async (req: AnnotatedRequest, res: Response) => {
    try {
      const result = await controllers.user.register(req.body as UserQueryRegister)
      if(result) {
        res.status(201)
        res.json(result)
      }
      else {
        res.status(401)
        res.json({
          error: `incorrect details`
        })
      }
    } catch(e) {
      res.status(401)
      res.json({
        error: e.toString()
      })
    }
  }

  const getToken = async (req: AnnotatedRequest, res: Response) => {
    const result = await controllers.user.getToken({
      id: req.user.id
    })
    res.status(201)
    res.json(result)
  }

  const updateSettings = async (req: AnnotatedRequest, res: Response) => {
    const result = await controllers.user.updateMeta({
      id: req.user.id,
    }, req.body)
    res.status(201)
    res.json(result)
  }

  const updatePassword = async (req: AnnotatedRequest, res: Response) => {
    const data = req.body as UserQueryUpdatePassword
    const result = await controllers.user.updatePassword({
      id: req.user.id,
    }, data)
    res.status(200)
    res.json(result)
  }

  return {
    status: asyncHandler(status),
    login: asyncHandler(login),
    register: asyncHandler(register),
    getToken: asyncHandler(getToken),
    updateSettings: asyncHandler(updateSettings), 
    updatePassword: asyncHandler(updatePassword),
  }
}

export default UserRoutes