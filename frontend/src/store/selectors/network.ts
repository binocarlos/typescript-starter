import { Selector } from 'reselect'

import {
  RootState,
} from '../../types/store'

import {
  GlobalLoadingProps,
} from '../../types/app'

export const globalLoading: Selector<RootState, GlobalLoadingProps> = (state) => state.network.globalLoading

export default {
  globalLoading,
}