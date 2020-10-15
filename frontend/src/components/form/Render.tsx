import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import { Field, FormikErrors, FormikTouched } from 'formik'
import nestedProperty from 'nested-property'

import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import utils from './utils'

import {
  FormSchema,
  FormSchemaField,
  FormHandlers,
} from '../../types/form'

import {
  ComponentName,
} from './fields'

const useStyles = makeStyles(theme => ({
  errorContainer: {
    marginTop: theme.spacing(2),
  },
  errorText: {
    color: theme.palette.error.main,
  },
  divider: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  fullHeight: {
    height: '100%',
  },
  mainError: {
    padding: theme.spacing(1),
  },
}))

function isRowFieldArray(array: FormSchemaField[] | FormSchemaField): array is FormSchemaField[] {
  return array.constructor === Array
}

interface FormWrapperItemProps {
  item: FormSchemaField,
  values: any,
  errors: FormikErrors<any>,
  touched: FormikTouched<any>,
  handlers?: FormHandlers,
}

const FormWrapperItem: FC<FormWrapperItemProps> = ({
  item,
  values,
  errors,
  touched,
  handlers,  
}) => {

  const fieldError = nestedProperty.get(errors, item.id)
  const fieldTouched = nestedProperty.get(touched, item.id)

  return (
    <Field
      name={ item.id }
      component={ utils.getComponent(item.component as ComponentName) }
      item={ item }
      values={ values }
      error={ fieldError }
      touched={ fieldTouched }
      handlers={ handlers }
    />
  )
}

interface FormWrapperRowProps {
  rowKey: number,
  row: FormSchemaField[] | FormSchemaField,
  values: any,
  errors: FormikErrors<any>,
  touched: FormikTouched<any>,
  handlers?: FormHandlers,
}

const FormWrapperRow: FC<FormWrapperRowProps> = ({
  rowKey,
  row,
  values,
  errors,
  touched,
  handlers,
}) => {
  const classes = useStyles()
  if (isRowFieldArray(row)) {
    // TODO: find out a better way to do this
    // <Grid sm={ colSize} /> complains
    // at just "number"
    const colSize = Math.floor(12 / row.length) as (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)
    return (
      <>
        {
          row
            .filter(item => {
              if(!handlers || !handlers.hidden) return true
              return handlers.hidden({
                name: item.id,
                values,
              }) ? false : true
            })
            .map((item, i) => (
              <Grid item xs={ 12 } sm={ colSize } key={ rowKey + '-' + i }>
                <FormWrapperItem
                  item={ item }
                  values={ values }
                  errors={ errors }
                  touched={ touched }
                  handlers={ handlers }
                />
              </Grid>
            ))
        }
      </>
    )
  }
  else if(row.divider) {
    return (
      <Grid item xs={ 12 } key={ rowKey }>
        {
          !row.title ? (
            <Divider className={ classes.divider } />
          ) : (
            <Typography
              variant='subtitle1'
              style={{
                fontWeight: 'bold',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              { row }
            </Typography>
          )
        }
        
      </Grid>
    )
  }
  else {
    if(handlers && handlers.hidden && handlers.hidden({
      name: row.id,
      values,
    })) {
      return null
    }
    
    return (
      <Grid item xs={12} key={ rowKey }>
        <FormWrapperItem
          item={ row }
          values={ values }
          errors={ errors }
          touched={ touched }          
          handlers={ handlers }
        />
      </Grid>
    )
  }
}

interface FormRenderProps {
  schema: FormSchema,
  handlers?: FormHandlers,
  error?: string,
  values: any,
  errors: FormikErrors<any>,
  touched: FormikTouched<any>,
  showErrors: boolean,
  fullHeight?: boolean,
  isValid: boolean,
}

const FormRender: FC<FormRenderProps> = ({
  schema,
  handlers,
  error,
  values,
  errors,
  touched,
  showErrors,
  fullHeight,  
}) => {

  const classes = useStyles()

  return (
    <React.Fragment>
      <Grid
        container
        spacing={ 2 }
        className={classnames({
          [classes.fullHeight]: fullHeight,
        })}
      >
        {
          schema.map((row, i) => {
            return (
              <FormWrapperRow
                key={ i }
                rowKey={ i }
                row={ row }
                values={ values }
                errors={ errors }
                touched={ touched }
                handlers={ handlers }
              />
            )
          })
        }
        {
          error && (
            <div className={ classes.mainError }>
              <FormHelperText
                error={ true }
              >
                { error }
              </FormHelperText>
            </div>
          )
        }
      </Grid>
      {
        showErrors && Object.keys(errors).length > 0 && (
          <div className={ classes.errorContainer }>
            <Typography className={ classes.errorText }>
              There are errors in the form:
            </Typography>
            <ul className={ classes.errorText }>
              {
                Object.keys(errors).map((key, i) => (
                  <li key={ i }>
                    <Typography className={ classes.errorText }>
                      { key }: { errors[key] }
                    </Typography>
                  </li>
                ))
              }
            </ul>
          </div> 
        )
      }
    </React.Fragment>
  )
}

export default FormRender