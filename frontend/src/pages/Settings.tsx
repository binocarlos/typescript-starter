import React, { useCallback, FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import * as yup from 'yup'

import {
  UserQueryUpdatePassword,
} from 'typescript-starter-types/src/user'

import SectionHeader from '../components/widgets/SectionHeader'
import Form from '../components/form/Form'

import authActions from '../store/modules/auth'
import authSelectors from '../store/selectors/auth'

import {
  FormSchema,
  FormHandlers,
} from '../types/form'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  buttons: {
    marginTop: theme.spacing(4),
  },
  footer: {
    marginTop: theme.spacing(4),
  },
}))

interface FormType {
  password: string,
  confirm_password: string,
}

const formSchema: FormSchema = [{
  id: 'password',
  title: 'Change Password',
  helperText: 'Enter a new password',
  inputProps: {
    type: 'password',
  },
}, {
  id: 'confirm_password',
  title: 'Confirm Password',
  helperText: 'Confirm your password',
  inputProps: {
    type: 'password',
  },
}]

const validationSchema = yup.object().shape({
  password: yup.string().required(),
  confirm_password: yup.string().required(),
})

const handlers: FormHandlers = {
  validate: (values) => {
    const errors: Record<string, string> = {}
    if(values.password && values.confirm_password && values.password != values.confirm_password) {
      errors.password = errors.confirm_password = 'The passwords must match'
    }
    return errors
  },
}

const Settings: FC = ({

}) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  
  const loading = false
  const error = undefined

  const onSubmit = useCallback((payload: FormType) => {
    dispatch(authActions.updatePassword(payload))
  }, [])

  const userData = useSelector(authSelectors.data)

  const initialValues: FormType = {
    password: '',
    confirm_password: '',
  }

  if(!userData) return null

  return (
    <div className={ classes.root }>
      <Paper className={ classes.paper }>
        <SectionHeader
          title="Settings"
        />
        <Typography gutterBottom variant="body1">
          Email: { userData.email }
        </Typography>
        <Form
          schema={ formSchema }
          validationSchema={ validationSchema }
          handlers={ handlers }
          error={ error }
          initialValues={initialValues }
          onSubmit={ onSubmit }
        >
          {
            ({
              isValid,
              onSubmit,
            }) => {
              return (
                <div className={ classes.buttons }>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={ loading || !isValid }
                    onClick={ onSubmit }
                  >
                    Save
                  </Button>
                </div>
              )
            }
          }
        </Form>
      </Paper>
    </div>
  )
}

export default Settings