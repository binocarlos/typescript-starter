import React, { useCallback, useMemo, FC } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { useSelector } from 'react-redux'
import { useDropzone } from 'react-dropzone'

import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'

import useDispatchThunk from '../../hooks/withDispatchThunk'

import Loading from '../../system/Loading'

import UploadStatus from '../../uploader/UploadStatus'
import HelperText from './HelperText'

import fileuploadActions from '../../../store/modules/fileupload'
import fileuploadSelectors from '../../../store/selectors/fileupload'

import icons from '../../../icons'

import {
  getUrl,
} from '../../../utils/storage'

import {
  FormFieldProps,
  FormFileValue,
} from '../../../types/form'

const DeleteIcon = icons.delete
const UploadIcon = icons.upload

const useStyles = makeStyles(theme => createStyles({
  container: {
    marginTop: theme.spacing(1),
  },
  image: {
    maxWidth: '200px',
    border: '1px solid #000',
  },
  editIcon: {
    marginRight: theme.spacing(1),
  },
  buttonTitle: {
    display: 'inline-block',
    paddingRight: '10px',
  },
  buttonIcon: {
    width: '20px',
    height: '20px',
  },
  button: {
    margin: theme.spacing(1),
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
  },
  intro: {
    marginRight: theme.spacing(2),
  },
  imageContainer: {
    marginTop: theme.spacing(2),
  },
  filepath: {
    marginTop: theme.spacing(2),
  }
}))

const isImage = (data: FormFileValue): boolean => {
  if(data.type.indexOf('image') == 0) return true
  if(data.filename.match(/\.{jpg,png,jpeg,gif}$/i)) return true
  return false
}

const ImageField: FC<FormFieldProps> = ({
  field: {
    name,
    value,
  },
  form: {
    setFieldValue,
  },
  item,
}) => {
  const classes = useStyles()
  const dispatch = useDispatchThunk()
  
  const uploadInProgress = useSelector(fileuploadSelectors.inProgress)
  const uploadStatus = useSelector(fileuploadSelectors.status)
  const uploadError = useSelector(fileuploadSelectors.network.uploadFiles.error)

  const {
    getRootProps,
    getInputProps,
    inputRef,
  } = useDropzone({
    onDrop: async (files) => {
      if(files.length <= 0) return
      const result = await dispatch(fileuploadActions.uploadFiles({
        files,
        path: item.meta ? item.meta.path : '',
      }))
      if(!result || !result[0]) return
      setFieldValue(name, result[0])
    },
    multiple: false,
  })

  const onOpenUploader = useCallback(() => {
    if(!inputRef.current) return
    inputRef.current.click()
  }, [])

  const onResetValue = useCallback(() => {
    setFieldValue(name, null)
  }, [name])

  const buttons = useMemo(() => {

    const buttonItems = [{
      title: 'Upload',
      help: 'Upload an image from your computer',
      icon: UploadIcon,
      handler: onOpenUploader,
    }]

    if(!item.meta || !item.meta.noReset) {
      buttonItems.push({
        title: 'Reset',
        help: 'Clear this image',
        icon: DeleteIcon,
        handler: onResetValue
      })
    }
    
    return buttonItems
      .map((item, i) => {
        const Icon = item.icon
        return (
          <Tooltip title={ item.help } key={ i }>
            <Button
              variant="contained"
              size="small"
              onClick={ item.handler }
              className={ classes.button }
            >
              { item.title }&nbsp;&nbsp;&nbsp;<Icon className={ classes.buttonIcon } />
            </Button>
          </Tooltip>
        )
      })
  }, [
    onResetValue,
  ])

  const helperText = item.helperText

  return uploadInProgress ? (
    <div className={ classes.container }>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {
            uploadInProgress ? (
              <UploadStatus
                error={ uploadError }
                status={ uploadStatus }
              />
            ) : (
              <Loading />
            )
          }
        </Grid>
      </Grid>
    </div>
  ) : (
    <div className={ classes.container }>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <div className={ classes.info }>
            <div className={ classes.intro }>
              <InputLabel 
                htmlFor={ name }>{ item.title || item.id }
              </InputLabel>
              {
                helperText ? (
                  <FormHelperText error={ false } id={ name + "-helperText" }>
                    { helperText }
                  </FormHelperText>
                ) : null
              }
            </div>
            { buttons }
          </div>
          {
            value && isImage(value) && (
              <div className={ classes.imageContainer }>
                <img className={ classes.image } src={ getUrl(value.filepath) } />
              </div>
            )
          }
          {
            value && (
              <div className={ classes.filepath }>
                <Typography variant="caption">
                  { value.filename }
                </Typography>
              </div>
            )
          }
        </Grid>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
        </div>
      </Grid>
      {
        uploadError && (
          <HelperText 
            helperText={ uploadError }
            error
            touched
          />
        )
      }
    </div>
  )
}

export default ImageField
