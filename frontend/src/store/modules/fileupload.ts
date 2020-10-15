import Bluebird from 'bluebird'
import {
  CreateReducer,
  CreateAction,
} from '../utils/store'
import {
  getUrl,
} from '../utils/api'

import {
  FileUploadStatus,
  FileUploadState,
  ReducerHandler,
  ThunkHandler,
} from '../../types/store'

import {
  PayloadUploadFiles,
  PayloadSetProgress,
} from '../../types/fileupload'

import {
  StorageResponseUpload,
} from 'typescript-starter-types/src/storage'

//import networkWrapper from '../utils/networkWrapper'

const prefix = 'fileupload'

//const wrapper = networkWrapper.factory(prefix)

/*

  initial state

*/
const initialState: FileUploadState = {
  // are we currently uploading
  inProgress: false,

  // a map of filename onto an object with:
  //  * startime
  //  * percentDone
  //  * remainingTime (calculated by the startTime, nowTime and percentageDone)
  status: {},
}

/*

  utils

*/
const resetState = (state: FileUploadState) => {
  state.inProgress = false
  state.status = {}
}

const getFileUrlQuery = (file: File, path: string = ''): string => {
  const params: Record<string, string | number> = {
    filename: file.name,
    type: file.type,
    size: file.size,
    path,
  }
  return Object
    .keys(params)
    .filter(key => params[key])
    .map(key => {
      return `${key}=${encodeURIComponent(params[key])}`
    })
    .join('&')
}

const apiUploader = ({
  url,
  file,
  path,
  onProgress,
}: {
  url: string,
  file: File,
  path: string,
  onProgress: (values: ProgressEvent) => void,
}): Promise<StorageResponseUpload> => {
  return new Promise((resolve, reject) => {

    const token = localStorage.getItem('token')
    const xhr = new XMLHttpRequest()

    const eventOnProgress = (e: ProgressEvent) => {
      if (e.lengthComputable) {
        onProgress(e)
      }
    }

    const eventOnFailure = (e: ProgressEvent | string) => {
      return reject(e)
    }
    
    const eventOnSuccess = (result: StorageResponseUpload) => {
      return resolve(result)
    }

    xhr.upload.addEventListener("progress", eventOnProgress, false)
    xhr.upload.addEventListener("error", eventOnFailure)
    xhr.upload.addEventListener("abort", eventOnFailure)

    xhr.onreadystatechange = () => {
      const { readyState, status } = xhr
      if (readyState === 4) {
        const headers = xhr.getAllResponseHeaders()

        const response = headers.indexOf('content-type: application/json') >= 0 ?
          JSON.parse(xhr.response) : 
          xhr.response

        if (status < 400) {
          eventOnSuccess(response)
        }
        else {
          const bodyMessage = response.error ?
            response.error :
            response
          eventOnFailure(`${status}: ${bodyMessage}`)
        }
      }
    }

    const queryParams = getFileUrlQuery(file, path)
    const seperator = url.indexOf('?') >= 0 ?
      '&' :
      '?'
    let useUrl = url + seperator + queryParams
    xhr.open('POST', useUrl, true)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.send(file)
  })
}

/*

  reducers

*/
const reset: ReducerHandler<FileUploadState, void> = (state, action) => {
  resetState(state)
}

const startUploads: ReducerHandler<FileUploadState, PayloadUploadFiles> = (state, action) => {
  resetState(state)
  const baseStatus: FileUploadStatus = {}
  state.status = action.payload.files.reduce((all, file) => {
    all[file.name] = {
      startTime: new Date().getTime(),
      size: file.size,
      uploadedBytes: 0,
      totalBytes: 0,
      percentDone: 0,
      remainingTime: 0,
    }
    return all
  }, baseStatus)
}

const setUploadedProgress: ReducerHandler<FileUploadState, PayloadSetProgress> = (state, action) => {
  const {
    filename,
    values: {
      loaded,
      total,
    },
  } = action.payload

  const percent = Math.floor((loaded / total) * 100)

  const status = state.status[filename] || {}
  
  const timeUploading = (new Date().getTime()) - status.startTime
  const timePerPercent = percent > 0 ? timeUploading / percent : 0
  const percentLeft = 100 - percent
  const timeLeft = percentLeft * timePerPercent

  status.percentDone = percent
  status.remainingTime = timeLeft
  status.uploadedBytes = loaded
  status.totalBytes = total

  state.status[filename] = status
}

const finish: ReducerHandler<FileUploadState, void> = (state, action) => {
  state.inProgress = false
}

/*

  thunks

*/
const uploadFiles: ThunkHandler<PayloadUploadFiles, StorageResponseUpload[]> = (payload) => async (dispatch, getState) => {
  dispatch(actions.startUploads(payload))
  const url = getUrl(`/storage/upload`)
  try {
    const results = await Bluebird.map(payload.files, async file => apiUploader({
      url,
      file,
      path: payload.path,
      onProgress: (values: ProgressEvent) => {
        dispatch(actions.setUploadedProgress({
          filename: file.name,
          values,
        }))
      },
    }))
    dispatch(actions.reset())
    return results
  } catch(e) {
    dispatch(actions.reset())
    throw(e)
  }
}

/*

  collections

*/
const reducers = {
  reset,
  startUploads,
  setUploadedProgress,
  finish,
}

export const actions = {
  reset: CreateAction(prefix, `reset`, reset),
  startUploads: CreateAction(prefix, `startUploads`, startUploads),
  setUploadedProgress: CreateAction(prefix, `setUploadedProgress`, setUploadedProgress),
  finish: CreateAction(prefix, `finish`, finish),
  uploadFiles,
}

export const reducer = CreateReducer<FileUploadState>({
  prefix,
  initialState,
  reducers,
})

export default actions