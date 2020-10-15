import React, { useCallback, useState, FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import * as yup from 'yup'

import {
  ItemRecord,
} from 'typescript-starter-types/src/database_records'

import {
  ItemRecordCore,
} from 'typescript-starter-types/src/item'

import {
  TableSchema,
} from '../types/app'

import SectionHeader from '../components/widgets/SectionHeader'
import Table from '../components/table/SimpleTable'
import Form from '../components/form/Dialog'
import Window from '../components/dialog/Window'

import itemActions from '../store/modules/items'
import itemSelectors from '../store/selectors/items'

import {
  FormSchema,
} from '../types/form'

import icons from '../icons'

const AddIcon = icons.add
const EditIcon = icons.edit
const DeleteIcon = icons.delete

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
  actionButton: {
    marginLeft: theme.spacing(1), 
  },
}))

interface FormType {
  name: string,
}

const tableSchema: TableSchema = [{
  title: 'Name',
  name: 'name',
}]

const formSchema: FormSchema = [{
  id: 'name',
  title: 'Name',
  helperText: 'Enter a name',
}]

const validationSchema = yup.object().shape({
  name: yup.string().required(),
})

const emptyValues: FormType = {
  name: '',
}

const getItemValues = (item: ItemRecord): FormType => ({
  name: item.name,
})

const Items: FC = ({

}) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const [ editItemId, setEditItemId ] = useState<string>('')
  const [ deleteItem, setDeleteItem ] = useState<ItemRecord | null>(null)
  const [ initialValues, setInitialValues ] = useState<ItemRecordCore | null>(null)
  
  const items = useSelector(itemSelectors.data)
  const createLoading = useSelector(itemSelectors.network.create.loading)
  const updateLoading = useSelector(itemSelectors.network.update.loading)
  const createError = useSelector(itemSelectors.network.create.error)
  const updateError = useSelector(itemSelectors.network.update.error)

  const loading = createLoading || updateLoading
  const error = createError || updateError

  const onCreate = useCallback(() => {
    setEditItemId('new')
    setInitialValues(emptyValues)
  }, [])

  const onEdit = useCallback((item: ItemRecord) => {
    setEditItemId(item.id)
    setInitialValues(getItemValues(item))
  }, [])

  const onDelete = useCallback((item: ItemRecord) => {
    setDeleteItem(item)
  }, [])

  const onCancelForm = useCallback(() => {
    setEditItemId('')
    setInitialValues(null)
  }, [])

  const onCancelDelete = useCallback(() => {
    setDeleteItem(null)
  }, [])

  const onSubmitForm = useCallback(async (payload: FormType) => {
    if(editItemId != 'new') {
      await dispatch(itemActions.update({
        query: {
          id: editItemId,
        },
        data: payload,
      }))
    } else {
      await dispatch(itemActions.create(payload))
    }
    onCancelForm()
  }, [
    editItemId,
  ])

  const onConfirmDelete = useCallback(async () => {
    if(!deleteItem) return
    await dispatch(itemActions.delete(deleteItem.id))
    onCancelDelete()
  }, [
    deleteItem,
  ])

  const getActions = useCallback((item) => {
    return (
      <>
        <Button
          className={ classes.actionButton }
          variant="contained"
          size="small"
          onClick={ () => onDelete(item) }
        >
          <DeleteIcon />&nbsp;Delete
        </Button>
        <Button
          className={ classes.actionButton }
          variant="contained"
          size="small"
          onClick={ () => onEdit(item) }
        >
          <EditIcon />&nbsp;Edit
        </Button>
      </>
    )
  }, [
    classes,
  ])

  return (
    <div className={ classes.root }>
      <Paper className={ classes.paper }>
        <SectionHeader
          title="Items"
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={ onCreate }
          >
            <AddIcon />&nbsp;Add Item
          </Button>
        </SectionHeader>
        <Table
          data={ items }
          fields={ tableSchema }
          getActions={ getActions }
        />
        {
          editItemId && (
            <Form
              withCancel
              size="sm"
              schema={ formSchema }
              validationSchema={ validationSchema }
              error={ error }
              initialValues={initialValues }
              onSubmit={ onSubmitForm }
              onCancel={ onCancelForm }
            />
          )
        }
        {
          deleteItem && (
            <Window
              open
              withCancel
              size="sm"
              title={ `Delete ${ deleteItem.name }?`}
              onSubmit={ onConfirmDelete }
              onCancel={ onCancelDelete }
            >
              Are you sure you want to delete { deleteItem.name }?
            </Window>
          )
        }
      </Paper>
    </div>
  )
}

export default Items