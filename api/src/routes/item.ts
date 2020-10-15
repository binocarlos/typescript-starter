import asyncHandler from 'express-async-handler'

import {
  ItemRecordCore,
  ItemRecordUpdate,
} from 'typescript-starter-types/src/item'

import {
  Response,
} from 'express'

import {
  RouteCreateRequest,
  AnnotatedRequest,
} from '../types/route'

const ItemRoutes = ({
  controllers,
}: RouteCreateRequest) => {

  const list = async (req: AnnotatedRequest, res: Response) => {
    const result = await controllers.item.list({
      search: req.params.search || '',
    })
    res.json(result)
  }

  const get = async (req: AnnotatedRequest, res: Response) => {
    const result = await controllers.item.get({
      id: req.params.id,
    })
    res.json(result)
  }

  const create = async (req: AnnotatedRequest, res: Response) => {
    const result = await controllers.item.create(req.body as ItemRecordCore)
    res.json(result)
  }

  const update = async (req: AnnotatedRequest, res: Response) => {
    const result = await controllers.item.update({
      id: req.params.id,
    }, req.body as ItemRecordUpdate)
    res.json(result)
  }

  const del = async (req: AnnotatedRequest, res: Response) => {
    const result = await controllers.item.delete({
      id: req.params.id,
    })
    res.json(result)
  }

  const updateMeta = async (req: AnnotatedRequest, res: Response) => {
    const result = await controllers.item.updateMeta({
      id: req.params.id,
    }, req.body)
    res.json(result)
  }

  return {
    list: asyncHandler(list),
    get: asyncHandler(get),
    create: asyncHandler(create),
    update: asyncHandler(update),
    delete: asyncHandler(del), 
    updateMeta: asyncHandler(updateMeta),
  }
}

export default ItemRoutes