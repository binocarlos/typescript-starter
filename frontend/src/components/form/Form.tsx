import React, { FC } from 'react'
import * as yup from 'yup'

import FormWrapper from './Wrapper'
import Render from './Render'

import {
  FormSchema,
  FormHandlers,
  FormWrapperChildrenFactory,
} from '../../types/form'

interface FormProps {
  schema: FormSchema,
  validationSchema?: yup.ObjectSchema,
  handlers?: FormHandlers,
  initialValues: any,
  error?: string,
  children: FormWrapperChildrenFactory,
  onSubmit: {
    (data: any): void,
  },
}

const Form: FC<FormProps> = ({
  schema,
  validationSchema,
  handlers = {},
  initialValues,
  error,
  onSubmit,
  children = () => {},
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
            <>
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
              {
                children({
                  isValid,
                  onSubmit,
                  values,
                  errors,
                  showErrors,
                  touched,
                })
              }
            </>
          )
        }
      }
    </FormWrapper>
  )
}

export default Form