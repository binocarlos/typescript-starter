import {
  IconComponentType,
} from './types/app'

import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import MenuIcon from '@material-ui/icons/Menu'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import UploadIcon from '@material-ui/icons/VerticalAlignTop'
import Item from '@material-ui/icons/Apps'

import Login from '@material-ui/icons/AccountCircle'
import Register from '@material-ui/icons/HowToReg'
import Logout from '@material-ui/icons/ExitToApp'
import Dashboard from '@material-ui/icons/Dashboard'
import Settings from '@material-ui/icons/Settings'

const icons: Record<string, IconComponentType> = {
  add: AddIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  menu: MenuIcon,
  moreVert: MoreVertIcon,
  upload: UploadIcon,
  login: Login,
  register: Register,
  logout: Logout,
  dashboard: Dashboard,
  settings: Settings,
  item: Item,
}

export default icons