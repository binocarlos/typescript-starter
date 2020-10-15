import {
  CreateReducer,
  CreateAction,
 } from '../utils/store'

import {
  SnackbarState,
  SnackbarStateType,
  ReducerHandler,
} from '../../types/store'

const prefix = 'snackbar'

const initialState: SnackbarState = {
  open: false,
  text: '',
  type: 'default',
}

const snackbarSetText = (state: SnackbarState, text: string, type: SnackbarStateType) => {
  state.open = true
  state.text = text
  state.type = type
}

function getReducer(type: SnackbarStateType): ReducerHandler<SnackbarState, string> {
  return (state, action) => snackbarSetText(state, action.payload, type)
}

const onClose: ReducerHandler<SnackbarState, void> = (state, action) => {
  state.open = false
}

const reducers = {
  setMessage: getReducer('default'),
  setSuccess: getReducer('success'),
  setWarning: getReducer('warning'),
  setError: getReducer('error'),
  setInfo: getReducer('info'),
  onClose,
}

export const actions = {
  setMessage: CreateAction(prefix, `setMessage`, reducers.setMessage),
  setSuccess: CreateAction(prefix, `setSuccess`, reducers.setSuccess),
  setWarning: CreateAction(prefix, `setWarning`, reducers.setWarning),
  setError: CreateAction(prefix, `setError`, reducers.setError),
  setInfo: CreateAction(prefix, `setInfo`, reducers.setInfo),
  onClose: CreateAction(prefix, `onClose`, reducers.onClose),
}

export const reducer = CreateReducer<SnackbarState>({
  prefix,
  initialState,
  reducers,
})

export default actions