import Storage from '../utils/storage'

import {
  StorageController,
  StorageQueryUpload,
  StorageResponseUpload,
  StorageQueryDownload,
  StorageResponseDownload,
} from 'typescript-starter-types/src/storage'

const StorageControllerFactory = (): StorageController => {

  const upload = async (query: StorageQueryUpload): Promise<StorageResponseUpload> => {
    const storage = Storage()

    const filepath = [
      'account',
      query.userid,
      query.path,
      `${new Date().getTime()}-${query.filename}`
    ].filter(p => p).join('/')

    const uploadStream = storage.streamUpload({
      filepath,
      contentType: query.type,
    })

    await new Promise((resolve, reject) => {
      uploadStream.on('finish', async () => {
        resolve()
      })
      uploadStream.on('error', reject)
      query.contentStream.pipe(uploadStream)   
    })

    return {
      filename: query.filename,
      filepath,
      type: query.type,
      size: query.size,
    }
  }

  const download = (query: StorageQueryDownload): StorageResponseDownload => {
    const storage = Storage()
    return storage.streamDownload({
      filepath: query.filepath,
    })
  }

  return {
    upload,
    download,
  }
}

export default StorageControllerFactory