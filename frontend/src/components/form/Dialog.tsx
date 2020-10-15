import React, { FC } from 'react'
import yup from 'yup'

import Window from '../dialog/Window'
import FormWrapper from './Wrapper'
import Render from './Render'

import {
  FormSchema,
  FormHandlers,
} from '../../types/form'

interface FormDialogProps {
  schema: FormSchema,
  validationSchema?: yup.ObjectSchema,
  handlers?: FormHandlers,
  initialValues: any,
  error?: string,
  loaading?: boolean,
  onSubmit: {
    (data: any): void,
  },
  onCancel: {
    (): void,
  },
  [other: string]: any,
}

const FormDialog: FC<FormDialogProps> = ({
  schema,
  validationSchema,
  handlers = {},
  initialValues,
  error,
  loading,
  onSubmit,
  onCancel,
  ...windowProps
}) => {
  return (
    <FormWrapper
      schema={ schema }
      validationSchema={ validationSchema }
      initialValues={ initialValues }
      handlers={ handlers }
      onSubmit={ onSubmit }
    >
      {
        ({
          isValid,
          values,
          errors,
          showErrors,
          touched,
          onSubmit,
        }) => {
          return (
            <Window
              open
              loading={ loading }
              disabled={ isValid ? false : true }
              onSubmit={ onSubmit }
              onCancel={ onCancel }
              { ...windowProps }
            >
              <Render
                fullHeight
                schema={ schema }
                handlers={ handlers }
                error={ error }
                isValid={ isValid }
                values={ values }
                errors={ errors }
                touched={ touched }
                showErrors={ showErrors }
              />
            </Window>
          )
        }
      }
    </FormWrapper>
  )
}

export default FormDialog