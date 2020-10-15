import {
  Readable,
} from 'stream'

export interface StorageController {
  upload(query: StorageQueryUpload): Promise<StorageResponseUpload>
  download(query: StorageQueryDownload): StorageResponseDownload
}

export interface StorageQueryUpload {
  userid: string,
  path: string,
  size: string,
  type: string,
  filename: string,
  contentStream: Readable,
}

export interface StorageResponseUpload {
  filename: string,
  filepath: string,
  size: string,
  type: string,
}

export interface StorageQueryDownload {
  filepath: string,
}

export interface StorageResponseDownload extends Readable {

}
