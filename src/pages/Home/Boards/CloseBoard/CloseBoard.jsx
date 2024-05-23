import { Avatar, Box, Button, Divider, IconButton } from '@mui/material'
import * as React from 'react'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import CloseIcon from '@mui/icons-material/Close'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { deleteBoardAPI, fetchAllBoardClosesAPI, updateBoardAPI } from '@/apis/boards.api'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import ConfirmationPopover from '@/components/ConfirmationPopover/ConfirmationPopover'
import { toast } from 'react-toastify'

const CloseBoard = () => {
  const [open, setOpen] = React.useState(false)
  const [boards, setBoards] = React.useState([])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [opencf, setOpenCf] = React.useState(null)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const user = useSelector((state) => state.user.auth)

  const boardsQuery = useQuery({
    queryKey: ['boardClose', user?._id],
    queryFn: async () => {
      if (!user?._id) return []
      return await fetchAllBoardClosesAPI(user?._id)
    }
  })

  React.useEffect(() => {
    if (boardsQuery.data) {
      setBoards(boardsQuery.data)
    }
  }, [boardsQuery.data])

  const queryClient = useQueryClient()

  const mutionReopenBoard = useMutation({
    mutationFn: (data) => updateBoardAPI(data.boardId, data.dataUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      queryClient.invalidateQueries({ queryKey: ['boardStarred'] })
      queryClient.invalidateQueries({ queryKey: ['boardClose'] })
      toast.success('Board reopen successfully!')
    }
  })

  const handleReopenBoard = (boardId) => {
    mutionReopenBoard.mutate({ boardId: boardId, dataUpdate: { _destroy: false } })
    handleClose()
  }

  const mutionDeleteBoard = useMutation({
    mutationFn: (boardId) => deleteBoardAPI(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boardClose'] })
      queryClient.invalidateQueries({ queryKey: ['boardStarred'] })
      toast.success('Board deleted successfully!')
    }
  })

  const handleDeleteBoard = (boardId) => {
    mutionDeleteBoard.mutate(boardId)
    handleClose()
  }

  if (!boards.length) return

  return (
    <Box>
      <Button
        onClick={handleOpen}
        variant='contained'
        sx={{
          bgcolor: '#091e420f',
          color: '#172b4d',
          boxShadow: 'none',
          mt: 4,
          '&:hover': {
            bgcolor: '#091e420f',
            color: '#172b4d',
            boxShadow: 'none'
          }
        }}
      >
        View all closed boards
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -20%)',
            width: 750,
            bgcolor: 'background.paper',
            boxShadow: 'none',
            p: 4,
            borderRadius: '7px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Inventory2OutlinedIcon />
              <Typography sx={{ fontSize: '20px' }} variant='h6'>
                Closed boards
              </Typography>
            </Box>
            <IconButton onClick={handleClose} aria-label='delete'>
              <CloseIcon />
            </IconButton>
          </Box>

          {boards?.map((board, index) => (
            <>
              <Box key={board._id} sx={{ display: 'flex', mt: 1, mb: 1, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 60, height: 40 }} src={board?.cover} variant='square' />
                  <Typography sx={{ fontSize: '16px', fontWeight: 400 }} variant='body'>
                    {board?.title}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    onClick={() => handleReopenBoard(board._id)}
                    sx={{
                      bgcolor: '#4F46E5',
                      mr: 1,
                      '&:hover': {
                        bgcolor: '#4F46E5'
                      }
                    }}
                    variant='contained'
                    disableElevation
                  >
                    Reopen
                  </Button>
                  <Button
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget)
                      setOpenCf(board._id)
                    }}
                    color='error'
                    startIcon={<DeleteOutlineOutlinedIcon />}
                    variant='contained'
                    disableElevation
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
              {index !== boards?.length - 1 && <Divider sx={{ bgcolor: '#091e420f' }} />}

              {board._id === opencf && (
                <ConfirmationPopover
                  title='Delete board?'
                  description='All lists, cards and actions will be deleted, and you won’t be able to re-open the board. There is no undo.'
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  handleClose={() => {
                    setAnchorEl(null)
                  }}
                  onConfirm={handleDeleteBoard}
                  confirmArgs={board._id}
                  button='Delete'
                />
              )}
            </>
          ))}
        </Box>
      </Modal>
    </Box>
  )
}

export default CloseBoard
