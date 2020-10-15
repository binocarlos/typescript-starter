import React, { useCallback, FC } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import Link from '../components/widgets/Link'

import * as yup from 'yup'

import useDispatchThunk from '../components/hooks/withDispatchThunk'

import Form from '../components/form/Form'

import authActions from '../store/modules/auth'
import authSelectors from '../store/selectors/auth'

import {
  FormSchema,
} from '../types/form'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
  },
  buttons: {
    marginTop: theme.spacing(4),
  },
  footer: {
    marginTop: theme.spacing(4),
  },
}))

interface FormType {
  username: string,
  password: string,
}

const formSchema: FormSchema = [{
  id: 'username',
  title: 'Email',
  helperText: 'Enter your email address',
}, {
  id: 'password',
  title: 'Password',
  helperText: 'Enter your password',
  inputProps: {
    type: 'password',
  },
}]

const validationSchema = yup.object().shape({
  username: yup.string().email().required(),
  password: yup.string().required(),
})

const Register: FC = ({

}) => {
  const classes = useStyles()
  const dispatch = useDispatchThunk()
  const loading = useSelector(authSelectors.network.register.loading)
  const error = useSelector(authSelectors.network.register.error)

  const onRegister = useCallback((payload: FormType) => {
    dispatch(authActions.register(payload))
  }, [])

  const initialValues: FormType = {
    username: '',
    password: '',
  }

  return (
    <div className={ classes.root }>
      <Paper className={ classes.paper }>
        <Typography gutterBottom variant="h6">
          Register
        </Typography>
        <Form
          schema={ formSchema } 
          validationSchema={ validationSchema }         
          error={ error }
          initialValues={ initialValues }
          onSubmit={ onRegister }
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
                    Register
                  </Button>
                </div>
              )
            }
          }
        </Form>
        <p>
          <Link name="login" path="/login">Click here</Link> to login...
        </p>
      </Paper>
    </div>
  )
}

export default Register