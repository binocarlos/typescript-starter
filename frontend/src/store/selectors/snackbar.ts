import { Selector } from 'reselect'

import {
  RootState,
  SnackbarState,
} from '../../types/store'

export const data: Selector<RootState, SnackbarState> = state => state.snackbar

export default {
  data,
}
