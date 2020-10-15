import { Selector } from 'reselect'

import {
  networkGroup,
} from './utils'

import {
  FileUploadStatus,
  RootState,
} from '../../types/store'

export const inProgress: Selector<RootState, boolean> = state => state.fileupload.inProgress
export const status: Selector<RootState, FileUploadStatus> = state => state.fileupload.status
export const network = networkGroup('fileupload', [
  'uploadFiles',
  'syncFiles',
])

export default {
  inProgress,
  status,
  network,
}