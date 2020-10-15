import {
  Route,
} from 'router5'

import {
  MiddlewareFactory as MiddlewareFactoryCore,
} from 'router5/dist/types/router'

import {
  Store,
  GetState,
} from './store'

export type RouterParams = Record<string, any>
export type DefaultDependencies = Record<string, any>

export interface RouteAuthenticateHandler {
  (store: Store): string | null
}

export interface RouteRedirectHandler {
  (getState: GetState): string | null,
}

export interface RouteTriggerHandler {
  (store: Store, params: RouterParams): Promise<void>
}

export interface AppRoute extends Route<DefaultDependencies> {
  auth?: RouteAuthenticateHandler,
  redirect?: string | RouteRedirectHandler,
  redirectParams?: RouterParams,
  onEnter?: RouteTriggerHandler[],
  onLeave?: RouteTriggerHandler[],
  children?: AppRoute[],
}

export interface MiddlewareFactory {
  (routes: AppRoute[]): MiddlewareFactoryCore,
}