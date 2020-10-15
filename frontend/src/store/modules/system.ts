import {
  CreateReducer,
  CreateAction,
} from '../utils/store'

import authActions from './auth'

import {
  SystemState,
  ReducerHandler,
  ThunkHandler,
} from '../../types/store'

const prefix = 'system'

/*

  initial state

*/
const initialState: SystemState = {
  initialised: false,
}

/*

  reducers

*/
const setInitialised: ReducerHandler<SystemState, boolean> = (state, action) => {
  state.initialised = action.payload
}

/*

  thunks

*/
const initialise: ThunkHandler<void, void> = () => async (dispatch, getState) => {
  await dispatch(authActions.authenticate(''))
  dispatch(actions.setInitialised(true))
}

/*

  collections

*/
const reducers = {
  setInitialised,
}

export const actions = {
  setInitialised: CreateAction(prefix, `setInitialised`, setInitialised),
  initialise,
}

export const reducer = CreateReducer<SystemState>({
  prefix,
  initialState,
  reducers,
})

export default actions
