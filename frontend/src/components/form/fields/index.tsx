import { $Keys } from 'utility-types'
import TextField from './Text'
import TextAreaField from './TextArea'
import RadioField from './Radio'
import CheckboxField from './Checkbox'
import MultipleCheckboxField from './MultipleCheckbox'
import SelectField from './Select'
import ColorField from './Color'
import ImageField from './Image'

const fields = {
  text: TextField,
  textarea: TextAreaField,
  radio: RadioField,
  checkbox: CheckboxField,
  multipleCheckbox: MultipleCheckboxField,
  select: SelectField,
  color: ColorField,
  image: ImageField,
}

export type ComponentName = $Keys<typeof fields>

export const defaultValues = {
  text: '',
  textarea: '',
  radio: '',
  checkbox: false,
  multipleCheckbox: {},
  select: '',
  color: {
    color: ''
  },
  image: null,
  markdown: '',
}

export default fields