import createNextState from 'immer'
import { ThunkAction } from 'redux-thunk'
import { AnyAction } from 'redux'

import {
  Action,
  GenericReducerHandler,
  ReducerHandler,
  ModuleReducerOptions,
  ThunkHandler,
  RootState,
} from '../../types/store'

/*

  createReducer({
    initialState,
    reducers,
  }) => (state, action)

  * initialState    the initialState for this reducer
  * reducers        a map of functions to reduce each action

  {
    initialState: {
      open: false,
    },
    reducers: {
      toggleOpen: (state, action) => {
        state.open = action.payload
      },
    },
  }

  you would emit an action like this:

  {
    type: 'toggleOpen',
    payload: {
      open: true,
    },
  }

*/

export const getActionName = (prefix: string, name: string): string =>
  `${prefix}/${name}`

export function CreateReducer<StateType>({
  initialState,
  reducers,
  prefix,
}: ModuleReducerOptions<StateType>): (state: StateType, action: Action<any>) => StateType {
  if(!reducers) throw new Error(`reducers required for CreateReducer`)
  const baseReducers: {
    [name: string]: GenericReducerHandler<StateType>,
  } = {}
  const useReducers = Object
    .keys(reducers)
    .reduce((all, name) => {
      const key = prefix ? getActionName(prefix, name) : name
      all[key] = reducers[name]
      return all
    }, baseReducers)

  return (state: StateType = initialState, action: Action<any>): StateType => {
    return createNextState<StateType, StateType>(state, draft => {
      const caseReducer = useReducers[action.type]
      return caseReducer ? caseReducer(draft, action) : state
    })
  }
}

/*

  createAction(actionName) => (payload)

  * actionName    the 'type' field of the action


  const actionFactory = createAction('toggleOpen')

  const action = actionFactory(true)

  action:
  
  {
    type: 'toggleOpen',
    payload: true,
  }

*/
export function CreateAction<StateType, PayloadType>(prefix: string, name: string, reducer: ReducerHandler<StateType, PayloadType>): (payload: PayloadType) => Action<PayloadType> {
  return (payload: PayloadType) => ({
    type: getActionName(prefix, name),
    payload,
  })
}
