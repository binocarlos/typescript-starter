import { Dispatch } from 'redux'
import { GetState } from './store'

import {
  OverridableComponent,
} from '@material-ui/core/OverridableComponent'

import {
  SvgIconTypeMap,
} from '@material-ui/core/SvgIcon/SvgIcon'

export type IconComponentType = OverridableComponent<SvgIconTypeMap<{}, "svg">>
export type ColorName = 'inherit' | 'primary' | 'secondary'
export type ColorNameIcon = "inherit" | "primary" | "secondary" | "error" | "disabled" | "action" | undefined
export type ColorNameTypography = "inherit" | "initial" | "primary" | "secondary" | "error" | "textPrimary" | "textSecondary" | undefined

export interface MenuItem {
  title: string,
  icon?: string,
  link?: string,
  params?: Record<string, any>,
  handler?: (dispatch: Dispatch<any>, getState: GetState) => void,
}

export interface MenuButtonItem {
  title: string,
  help?: string,
  icon?: string,
  secondaryIcon?: string,
  items?: MenuButtonItem[],
  handler?: {
    (): void,
  },
  link?: string,
  params?: Record<string, any>,
  meta?: Record<string, any>,
}

export interface GlobalLoadingOptions {
  transparent?: boolean,
  message?: string,
  error?: string,
  logs?: string[],
}

export interface GlobalLoadingProps extends GlobalLoadingOptions {
  active: boolean,
}

export interface TableSchemaField {
  title: string,
  name: string,
  numeric?: boolean,
  className?: string,
}

export type TableSchema = TableSchemaField[]