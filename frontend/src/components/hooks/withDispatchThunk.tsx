import {
  useDispatch,
} from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import {
  RootState,
} from '../../types/store'

const useDispatchThunk = () => {
  return useDispatch() as ThunkDispatch<RootState, {}, AnyAction>
}

export default useDispatchThunk
