import { ReactNode, ComponentType } from 'react'

import {
  FieldProps as FormikFieldProps,
  FormikValues,
  FormikConfig,
  FormikErrors,
  FormikTouched,
} from 'formik'

export interface FormHandlerProps {
  name: string,
  value?: any,
  values: FormikValues,
}

export interface FormHandlers {
  value?: {
    (props: FormHandlerProps): any,
  },
  disabled?: {
    (props: FormHandlerProps): boolean,
  },
  hidden?: {
    (props: FormHandlerProps): boolean,
  },
  validate?: FormikConfig<any>["validate"],
}

export interface FormSchemaOption {
  title: string,
  value: string,
}

export interface FormSchemaField {
  id: string,
  title?: string,
  helperText?: string,
  inputProps?: Record<string, any>,
  divider?: boolean,
  component?: string, 
  options?: FormSchemaOption[],
  // any other fields we want to pass into the component
  meta?: Record<string, any>,
}

export type FormSchema = (FormSchemaField[] | FormSchemaField)[]

export interface FormFieldProps extends FormikFieldProps {
  item: FormSchemaField,
  values: FormikValues,
  error?: string,
  touched?: boolean,
  disabled?: boolean,
  handlers?: FormHandlers,
  [other: string]: any,
}

export interface FormWrapperChildrenFactoryProps {
  isValid: boolean,
  values: any,
  errors: FormikErrors<any>,
  showErrors: boolean,
  touched: FormikTouched<any>,
  onSubmit: {
    (): void,
  }
}

export interface FormWrapperChildrenFactory {
  (props: FormWrapperChildrenFactoryProps): ReactNode,
}

export interface FormColorValue {
  inputColor?: string,
  color?: string,
  hue?: string,
  shade?: number,
}

export interface FormFileValue {
  type: string,
  filename: string,
}