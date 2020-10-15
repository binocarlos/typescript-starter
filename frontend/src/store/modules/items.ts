import bluebird from 'bluebird'

import {
  ItemRecord,
} from 'typescript-starter-types/src/database_records'

import {
  ItemQuery,
  ItemRecordCore,
  ItemRecordUpdate,
} from 'typescript-starter-types/src/item'

import {
  CreateReducer,
  CreateAction,
} from '../utils/store'

import {
  NetworkThunk,
} from '../utils/network'

import {
  ItemState,
  ReducerHandler,
  ThunkHandler,
} from '../../types/store'

import {
  handlers,
} from '../utils/api'

import snackbarActions from './snackbar'

interface UpdateItemQuery {
  query: ItemQuery,
  data: ItemRecordUpdate,
}

const prefix = 'items'

/*

  initial state

*/
const initialState: ItemState = {
  data: [],
}

/*

  reducers

*/
const setData: ReducerHandler<ItemState, ItemRecord[]> = (state, action) => {
  state.data = action.payload
}

/*

  thunks

*/
const list: ThunkHandler<void, void> = () => async (dispatch, getState) => {
  const data = await handlers.get<ItemRecord[]>('/items')
  dispatch(actions.setData(data))
}

const create: ThunkHandler<ItemRecordCore, void> = (payload) => async (dispatch, getState) => {
  await handlers.post<ItemRecordCore, ItemRecord>('/items', payload)
  await dispatch(actions.list())
  dispatch(snackbarActions.setSuccess(`item created`))
}

const update: ThunkHandler<UpdateItemQuery, void> = (payload) => async (dispatch, getState) => {
  await handlers.put<ItemRecordUpdate, ItemRecord>(`/items/${payload.query.id}`, payload.data)
  await dispatch(actions.list())
  dispatch(snackbarActions.setSuccess(`item updated`))
}

const del: ThunkHandler<string, void> = (id) => async (dispatch, getState) => {
  await handlers.delete<ItemRecord>(`/items/${id}`)
  await dispatch(actions.list())
  dispatch(snackbarActions.setSuccess(`item deleted`))
}

/*

  collections

*/
const reducers = {
  setData,
}

export const actions = {
  setData: CreateAction(prefix, `setData`, setData),
  list: NetworkThunk(prefix, 'list', list, {
    snackbar: true,
  }),
  create: NetworkThunk(prefix, 'create', create, {
    snackbar: true,
    globalLoading: {
      message: 'creating item...'
    },
  }),
  update: NetworkThunk(prefix, 'update', update, {
    snackbar: true,
    globalLoading: {
      message: 'saving item...'
    },
  }),
  delete: NetworkThunk(prefix, 'delete', del, {
    snackbar: true,
    globalLoading: {
      message: 'deleting item...'
    },
  }),
}

export const reducer = CreateReducer<ItemState>({
  prefix,
  initialState,
  reducers,
})

export default actions
