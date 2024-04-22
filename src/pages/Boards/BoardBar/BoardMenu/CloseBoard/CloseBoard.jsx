import { ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import { useMutation } from '@tanstack/react-query'
import { updateBoardAPI } from '@/apis/boards.api'
import { useNavigate } from 'react-router-dom'
import ConfirmationPopover from '@/components/ConfirmationPopover/ConfirmationPopover'
import { useState } from 'react'
import { toast } from 'react-toastify'

const CloseBoard = ({ board }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const navigate = useNavigate()

  const mutionCloseBoard = useMutation({
    mutationFn: (data) => updateBoardAPI(board._id, data),
    onSuccess: () => {
      navigate('/')
      toast.info(`${board.title} is closed. `)
    }
  })

  const handleCloseBoard = () => {
    mutionCloseBoard.mutate({ _destroy: true })
  }

  return (
    <>
      <MenuItem
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}
      >
        <ListItemIcon>
          <RemoveIcon />
        </ListItemIcon>
        <ListItemText>Close board</ListItemText>
      </MenuItem>

      <ConfirmationPopover
        title='Close board?'
        description='You can find and reopen closed boards at the bottom of your boards page.'
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handleClose={() => {
          setAnchorEl(null)
        }}
        onConfirm={handleCloseBoard}
        button='Close'
      />
    </>
  )
}

export default CloseBoard
