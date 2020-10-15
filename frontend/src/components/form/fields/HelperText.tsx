import React, { FC } from 'react'
import FormHelperText from '@material-ui/core/FormHelperText'

interface HelperTextProps {
  helperText: string | undefined,
  error: boolean | undefined,
  touched: boolean | undefined,
}

const HelperText: FC<HelperTextProps> = ({
  helperText,
  error,
  touched,
}) => {
  if(!error && !helperText) return null

  const hasError = touched && error ? true : false

  return (  
    <FormHelperText
      error={ hasError }
    >
      { helperText }
    </FormHelperText>
  )
}

export default HelperText