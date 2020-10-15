import {
  Readable,
  Writable,
} from 'stream'

import {
  Storage,
} from '@google-cloud/storage'

import settings from '../settings'

const StorageClientFactory = ({
  credentials_file = settings.google_storage_credentials_file,
  bucketName =  settings.google_storage_bucket_name,
  prefix = settings.google_storage_bucket_prefix,
}: {
  credentials_file?: string,
  bucketName?: string,
  prefix?: string,
} = {}) => {

  const storage = new Storage({
		keyFilename: credentials_file,
  })

  const bucket = storage.bucket(bucketName)

  const getPath = (filepath: string) => [prefix, filepath].filter(p => p).join('/')
  const getFile = (filepath: string) => bucket.file(getPath(filepath))

  const streamUpload = (query: {
    filepath: string,
    contentType: string,
  }): Writable => {
    const blob = getFile(query.filepath)
    const stream = blob.createWriteStream({
		  contentType: query.contentType,
    })
    return stream
  }

  const streamDownload = (query: {
    filepath: string,
  }): Readable => {
    const blob = getFile(query.filepath)
    const stream = blob.createReadStream({})
    return stream
  }

  const uploadFile = (query: {
    localFile: string,
    remoteFile: string,
  }) => bucket.upload(getPath(query.localFile), {
    gzip: true,
    destination: query.remoteFile,
    resumable: false,
  })

  const downloadFile = (query: {
    localFile: string,
    remoteFile: string,
  }) => getFile(query.remoteFile)
    .download({
      destination: query.localFile,
    })

  const listFiles = async (query: {
    prefix: string,  
  }) => {
    const [files] = await bucket.getFiles({
      prefix: getPath(query.prefix)
    })
    return files
  }

  const meta = async (query: {
    filepath: string,
  }) => {
    const metaData = await getFile(query.filepath).getMetadata()
    return metaData
  }

  return {
    streamUpload,
    streamDownload,
    uploadFile,
    downloadFile,
    listFiles,
    meta,
  }
}

export default StorageClientFactory