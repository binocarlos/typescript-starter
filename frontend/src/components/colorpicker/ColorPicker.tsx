import React, { useCallback, useMemo, FC } from 'react'
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles'
import * as colors from '@material-ui/core/colors'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import Radio from '@material-ui/core/Radio'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import CheckIcon from '@material-ui/icons/Check'
import Slider from '@material-ui/core/Slider'
import { rgbToHex } from '@material-ui/core/styles/colorManipulator'
import colorUtils from '../../utils/color'

import {
  FormColorValue,
} from '../../types/form'

const colorMap = colors as {
  [name: string]: Record<string, string>,
}

const hues = Object.keys(colorMap).slice(1, 20)

const shades = ['900', '800', '700', '600', '500', '400', '300', '200', '100', '50', 'A700', 'A400', 'A200', 'A100']

const useStyles = makeStyles(theme => createStyles({
  radio: {
    padding: 0,
  },
  radioIcon: {
    width: 48,
    height: 48,
    border: '1px solid black',
    margin: '1px',
  },
  radioIconSelected: {
    width: 48,
    height: 48,
    border: '1px solid white',
    color: theme.palette.common.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swatch: {
    width: '100%',
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  slider: {
    width: 'calc(100% - 80px)',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  colorBar: {
    marginTop: theme.spacing(2),
  },
  colorSquare: {
    width: 64,
    height: 64,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid black',
    margin: '1px',
    cursor: 'pointer',
  },
  button: {
    marginLeft: theme.spacing(1),
  },
}))

/*

  value:
    color
    hue
    shade

  intent

*/

const DEFAULT_VALUES: Record<string, FormColorValue> = {
  primary: {
    color: '#2196f3',
    hue: 'blue',
    shade: 4,
  },
  secondary: {
    color: '#f50057',
    hue: 'pink',
    shade: 11,
  },
}

interface ColorToolProps {
  value: FormColorValue,
  intent: string,
  onUpdate: (value: FormColorValue) => void,
}

const ColorTool: FC<ColorToolProps> = ({
  value,
  intent = 'primary',
  onUpdate,
}) => {

  const classes = useStyles()
  const theme = useTheme()

  const values = useMemo<Required<FormColorValue>>(
    () => {
      const givenValues = value || {}
      const defaultValues = DEFAULT_VALUES[intent]
      const ret = Object.assign({}, defaultValues, givenValues)
      if(!ret.inputColor) ret.inputColor = ret.color
      if(!ret.color) ret.color = defaultValues.color
      return ret as Required<FormColorValue>
    },
    [
      value,
      intent,
    ]
  )

  const {
    color,
    inputColor,
    shade,
  } = values

  const changeValues = useCallback(
    (updates) => onUpdate(Object.assign({}, value, updates)),
    [onUpdate,value]
  )

  const handleChangeColor = useCallback(
    (event) => {
      const {
        target: { value: color },
      } = event
      const newValues: FormColorValue = {
        inputColor: color,
      }
      if(colorUtils.isRgb(color)) {
        newValues.color = color
      }
      changeValues(newValues)
    },
    []
  )

  const handleChangeHue = useCallback(
    (event) => {
      const {
        target: { value: hue },
      } = event
      if(!values.shade) return
      const shade = shades[values.shade]
      
      const color = colorMap[hue][shade]
      changeValues({
        hue,
        color,
        inputColor: color,
      })
    },
    [
      shades,
      values,
    ]
  )

  const handleChangeShade = useCallback(
    (event, shade) => {
      if(!values.hue) return
      const shadeValue = shades[shade]
      const color = colorMap[values.hue][shadeValue]
      changeValues({
        shade,
        color,
        inputColor: color,
      })
    },
    [
      colors,
      values,
      shades,
    ]
  )

  const colorBar = useMemo(
    () => {
      const background = theme.palette.augmentColor({ main: color })
      return (
        <Grid container className={ classes.colorBar }>
          {['dark', 'main', 'light'].map(key => {

            let colorString = ''

            if(key == 'dark') colorString = background.dark
            else if(key == 'main') colorString = background.main
            else if(key == 'light') colorString = background.light

            return (
              <div
                className={ classes.colorSquare }
                style={{ backgroundColor: colorString }}
                key={ key }
                onClick={ () => {
                  handleChangeColor({
                    target: {
                      value: rgbToHex(colorString)
                    },
                  })
                }}
              >
                <Typography
                  variant="caption"
                  style={{ color: theme.palette.getContrastText(colorString) }}
                >
                  { rgbToHex(colorString) }
                </Typography>
              </div>
            )  
          })}
        </Grid>
      )
    },
    [
      color,
    ]
  )

  const colorSwatch = useMemo(
    () => {
      return (
        <div className={ classes.swatch }>
          {
            hues.map(hue => {
              const backgroundColor = colorMap[hue][shades[shade]]

              return (
                <Tooltip placement="right" title={ hue } key={ hue }>
                  <Radio
                    className={ classes.radio }
                    color="default"
                    checked={ color === backgroundColor }
                    onChange={ handleChangeHue }
                    value={ hue }
                    name={ intent }
                    aria-labelledby={ `tooltip-${intent}-${hue}` }
                    icon={<div className={ classes.radioIcon } style={{ backgroundColor }} />}
                    checkedIcon={
                      <div className={ classes.radioIconSelected } style={{ backgroundColor }}>
                        <CheckIcon style={{ fontSize: 30 }} />
                      </div>
                    }
                  />
                </Tooltip>
              )
            })
          }
        </div>
      )
    },
    [
      color,
    ]
  )

  return (
    <div>
      
      { colorSwatch }

      <div className={ classes.sliderContainer }>
        <Typography id="ShadeSliderLabel">Shade:</Typography>
        <Slider
          className={ classes.slider }
          value={ shade }
          min={ 0 }
          max={ 13 }
          step={ 1 }
          onChange={ handleChangeShade }
          aria-labelledby="ShadeSliderLabel"
        />
        <Typography>{ shades[shade] }</Typography>
      </div>

      <Input
        id="color-value"
        value={ inputColor }
        onChange={ handleChangeColor }
        inputProps={{
          'aria-label': `Color`,
        }}
        fullWidth
      />
        
      { colorBar }
    </div>
   
  )
}

export default ColorTool