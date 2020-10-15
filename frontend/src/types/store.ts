import { State } from 'router5'
import { ThunkAction } from 'redux-thunk'
import { Dispatch, AnyAction } from 'redux'

import {
  ItemRecord,
  UserRecord,
} from 'typescript-starter-types/src/database_records'

import {
  GlobalLoadingOptions,
  GlobalLoadingProps,
} from './app'

/*

  store state

*/
export interface AuthState {
  loaded: boolean,
  data: UserRecord | null,
}

export interface FileUploadStatus {
  [name: string]: {
    startTime: number,
    size: number,
    uploadedBytes: number,
    totalBytes: number,
    percentDone: number,
    remainingTime: number,
  }
}

export interface FileUploadState {
  inProgress: boolean,
  status: FileUploadStatus
}

export interface NetworkStateLoading {
  [name: string]: boolean,
}

export interface NetworkStateErrors {
  [name: string]: string,
}

export interface NetworkState {
  globalLoading: GlobalLoadingProps,
  loading: NetworkStateLoading,
  errors: NetworkStateErrors,
}

export interface RouterState {
  route: State | null,
  previousRoute: State | null,
  transitionRoute: State | null,
  transitionError: any | null,
}

export type SnackbarStateType = 'default' | 'success' | 'warning' | 'error' | 'info'

export interface SnackbarState {
  open: boolean,
  text: string,
  type: SnackbarStateType,
}

export interface SystemState {
  initialised: boolean,
}

export interface ItemState {
  data: ItemRecord[],
}

export interface RootState {
  auth: AuthState,
  fileupload: FileUploadState,
  network: NetworkState,
  router: RouterState,
  snackbar: SnackbarState,
  system: SystemState,
  items: ItemState,
}

/*

  store api

*/
export interface GetState {
  (): RootState,
}

export interface Store {
  getState: GetState,
  dispatch: Dispatch<any>,
}

export interface Action<PayloadType> {
  type: string,
  payload: PayloadType,
}

// a single reducer function that knows about it's payload
export interface ReducerHandler<StateType, PayloadType> {
  (state: StateType, action: Action<PayloadType>): void
}

// a single reducer function that does not know about the payload
export interface GenericReducerHandler<StateType> {
  (state: StateType, action: Action<any>): void,
}

// a collection of generic reducer functions
export type GenericReducerCollection<StateType> = Record<string, GenericReducerHandler<StateType>>

// the options we pass to create a module reducer function
export interface ModuleReducerOptions<StateType> {
  initialState: StateType,
  reducers: GenericReducerCollection<StateType>,
  prefix: string,
}

// the final combined function that is a single module reducer
export interface ModuleReducer<StateType> {
  (state: StateType, action: Action<any>): StateType,
}

// a thunk handler that knows it's payload and return type
export interface ThunkHandler<PayloadType, ReturnType> {
  (payload: PayloadType): ThunkAction<Promise<ReturnType | void>, RootState, {}, AnyAction>
}

export interface NetworkThunkOptions {
  snackbar?: boolean,
  globalLoading?: GlobalLoadingOptions,
}
