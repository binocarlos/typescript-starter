import yup from 'yup'
import React, { useState, useMemo, FC } from 'react'
import {
  Formik,
} from 'formik'
import utils from './utils'

import {
  FormSchema,
  FormHandlers,
  FormWrapperChildrenFactory,
} from '../../types/form'

interface FormWrapperProps {
  schema: FormSchema,
  validationSchema?: yup.ObjectSchema,
  initialValues: any,
  handlers?: FormHandlers,
  children: FormWrapperChildrenFactory,
  onSubmit: {
    (data: any): void,
  }
}

const FormWrapper: FC<FormWrapperProps> = ({
  schema,
  validationSchema,
  initialValues,
  handlers = {},
  children,
  onSubmit,
}) => {
  const [ showErrors, setShowErrors ] = useState(false)

  const useInitialValues = useMemo(() => utils.getInitialValues(schema, initialValues), [schema, initialValues])

  return (
    <Formik
      initialValues={ useInitialValues }
      validationSchema={ validationSchema }
      validateOnMount
      validate={ handlers.validate }
      onSubmit={ onSubmit }
    >
      {
        ({
          handleSubmit,
          isValid,
          values,
          errors,
          touched,
        }) => {
          const submitWrapper = () => {
            setShowErrors(true)
            handleSubmit()
          }
          return (
            <form>
              {
                children({
                  isValid,
                  values,
                  errors,
                  showErrors,
                  touched,
                  onSubmit: submitWrapper,
                })
              }
            </form>
          )
        }
      }
    </Formik>
  )
}

export default FormWrapper