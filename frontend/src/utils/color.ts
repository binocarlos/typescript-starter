import { hexToRgb } from '@material-ui/core/styles/colorManipulator'

export const isRgb = (string: string) => /#?([0-9a-f]{6})/i.test(string)

// convert hex into rgba(r,g,b,alpha)
export const getAlpha = (color: string, alpha: number | string): string => {
  return hexToRgb(color)
    .replace(/^rgb/, 'rgba')
    .replace(/\)$/, `, ${alpha})`)
}

export default {
  isRgb,
  getAlpha,
}