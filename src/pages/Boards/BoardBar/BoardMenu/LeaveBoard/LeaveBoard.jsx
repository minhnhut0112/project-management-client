import { ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

const LeaveBoard = ({ board }) => {
  return (
    <MenuItem>
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText>Leave board</ListItemText>
    </MenuItem>
  )
}

export default LeaveBoard
