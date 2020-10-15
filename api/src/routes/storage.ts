import asyncHandler from 'express-async-handler'

import {
  Response,
} from 'express'

import {
  RouteCreateRequest,
  AnnotatedRequest,
} from '../types/route'

const StorageRoutes = ({
  controllers,
}: RouteCreateRequest) => {

  const upload = async (req: AnnotatedRequest, res: Response) => {
    const result = await controllers.storage.upload({
      userid: req.user.id,
      path: req.query.path as string,
      filename: req.query.filename as string,
      size: req.query.size as string,
      type: req.query.type as string,
      contentStream: req,
    })
    res.json(result)
  }

  const download = async (req: AnnotatedRequest, res: Response) => {
    const downloadStream = await controllers.storage.download({
      filepath: req.query.filepath as string,
    })

    downloadStream
      .on('error', (err) => {
        res.status(500)
        res.end(err.toString())
      })
      .on('response', (remoteResponse) => {
        res.set({
          'content-type': remoteResponse.headers['content-type'],
          'content-length': remoteResponse.headers['content-type'],
          'etag': remoteResponse.headers['etag'],
        })
      })
      .pipe(res)
  }

  return {
    upload: asyncHandler(upload),
    download: asyncHandler(download),
  }
}

export default StorageRoutes