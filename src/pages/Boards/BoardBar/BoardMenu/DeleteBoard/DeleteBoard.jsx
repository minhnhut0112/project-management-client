import { updateBoardAPI } from '@/apis/boards.api'
import ConfirmationPopover from '@/components/ConfirmationPopover/ConfirmationPopover'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const DeleteBoard = ({ board }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const navigate = useNavigate()

  const mutionDeleteBoard = useMutation({
    mutationFn: (data) => updateBoardAPI(board._id, data),
    onSuccess: () => {
      navigate('/')
      toast.info(`${board.title} is closed. `)
    }
  })

  const handleDeleteBoard = () => {
    mutionDeleteBoard.mutate({ _destroy: true })
  }

  return (
    <>
      <MenuItem
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}
      >
        <ListItemIcon>
          <DeleteOutlineOutlinedIcon />
        </ListItemIcon>
        <ListItemText>Delete board</ListItemText>
      </MenuItem>

      <ConfirmationPopover
        title='Delete board?'
        description='All lists, cards and actions will be deleted, and you won’t be able to re-open the board. There is no undo.'
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handleClose={() => {
          setAnchorEl(null)
        }}
        onConfirm={handleDeleteBoard}
        button='Close'
      />
    </>
  )
}

export default DeleteBoard
