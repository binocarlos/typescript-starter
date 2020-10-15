import React, { useMemo, FC } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

const Theme: FC = (props) => {

  const theme = useMemo(() => {
    return createMuiTheme({
      
    })
  }, [])
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      { props.children }
    </MuiThemeProvider>
  );
}

export default Theme