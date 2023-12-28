import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import DragHandleOutlinedIcon from '@mui/icons-material/DragHandleOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Button, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNewCardAPI } from '@/apis/cards.api'
import { useConfirm } from 'material-ui-confirm'
import { deleteColumnAPI, updateColumnAPI } from '@/apis/columns.api'
import ListCards from '../../ListCards/ListCards'

const Column = ({ column }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyle = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const queryClient = useQueryClient()

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')

  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm)
    setNewCardTitle('')
  }

  const mutionAddCard = useMutation({
    mutationFn: (data) => createNewCardAPI(data)
  })

  const addNewcard = () => {
    if (!newCardTitle) {
      toggleOpenNewCardForm()
      return
    }

    mutionAddCard.mutate(
      { title: newCardTitle, boardId: column.boardId, columnId: column._id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['board'] })
          toast.success('Add card is successfully!')
        }
      }
    )

    toggleOpenNewCardForm()
  }

  const mutionDeleteColumn = useMutation({
    mutationFn: (id) => deleteColumnAPI(id)
  })

  const confirm = useConfirm()

  const handleDeleteColumn = () => {
    confirm({
      title: 'Delete Column ?',
      description: 'This action will delete the column and the cards inside! Are you sure!',
      confirmationText: 'Confirm',
      dialogProps: { maxWidth: 'xs' },
      confirmationButtonProps: { color: 'warning' }
    })
      .then(() => {
        mutionDeleteColumn.mutate(column._id, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board'] })
            toast.success('Deleted column is successfully')
          }
        })
      })
      .catch(() => {})
  }

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [openNewColumnTitleForm, setOpenNewColumnTitleForm] = useState(false)

  useEffect(() => {
    if (column) {
      setNewColumnTitle(column.title)
    }
  }, [column])

  const toggleOpenNewColumnTitleForm = () => {
    setOpenNewColumnTitleForm(!openNewColumnTitleForm)
  }

  const mutionEditColumnTitle = useMutation({
    mutationFn: (data) => updateColumnAPI(column._id, data)
  })

  const editColumnTitle = () => {
    if (newColumnTitle === column.title || !newColumnTitle) {
      toggleOpenNewColumnTitleForm()
      setNewColumnTitle(column.title)
      return
    }

    mutionEditColumnTitle.mutate(
      {
        title: newColumnTitle
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['board'] })
          toast.success('Edit Column Title is successfully!')
        }
      }
    )

    toggleOpenNewColumnTitleForm()
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes}>
      <Box
        {...listeners}
        sx={{
          cursor: 'pointer',
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.todolist.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/* Header */}
        <Box
          sx={{
            height: (theme) => theme.todolist.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {!openNewColumnTitleForm ? (
            <Typography
              onClick={toggleOpenNewColumnTitleForm}
              variant='h6'
              sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
            >
              {newColumnTitle}
            </Typography>
          ) : (
            <Box
              as='form'
              onSubmit={(e) => {
                e.preventDefault()
                editColumnTitle()
              }}
            >
              <TextField
                type='text'
                value={newColumnTitle}
                onBlur={editColumnTitle}
                autoFocus
                data-no-dnd='true'
                onChange={(e) => setNewColumnTitle(e.target.value)}
                size='small'
                sx={{
                  '& label': {
                    color: 'text.primary'
                  },

                  '& label.Mui-focused': {
                    color: (theme) => theme.palette.primary.main
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
            </Box>
          )}
          <Box>
            <Tooltip title='More Options'>
              <MoreHorizIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id='basic-column-dropdown'
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id='basic-menu-column-dropdown'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                    '& .add-icon': {
                      color: 'primary.main'
                    }
                  }
                }}
                onClick={toggleOpenNewCardForm}
              >
                <ListItemIcon className='add-icon'>
                  <AddCardOutlinedIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Add new cart</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize='small' />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize='small' />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize='small' />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                sx={{
                  '&:hover': {
                    color: 'error.light',
                    '& .delete-icon': {
                      color: 'error.light'
                    }
                  }
                }}
                onClick={handleDeleteColumn}
              >
                <ListItemIcon className='delete-icon'>
                  <DeleteOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <ListCards cards={column?.cards} columnTitle={column?.title} />

        <Box
          sx={{
            height: (theme) => theme.todolist.columnFooterHeight,
            p: 2
          }}
        >
          {!openNewCardForm ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
              <Button onClick={toggleOpenNewCardForm} startIcon={<AddCardOutlinedIcon />}>
                Add a cart
              </Button>
              <Tooltip title='Drag to move'>
                <DragHandleOutlinedIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              as='form'
              onSubmit={(e) => {
                e.preventDefault()
                addNewcard()
              }}
              sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}
            >
              <TextField
                placeholder='Enter card title...'
                type='text'
                onBlur={addNewcard}
                autoFocus
                data-no-dnd='true'
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                size='small'
                sx={{
                  '& label': {
                    color: 'text.primary'
                  },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': {
                    color: (theme) => theme.palette.primary.main
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box data-no-dnd='true' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button type='submit' sx={{ boxShadow: 'none' }} variant='contained'>
                  Add
                </Button>
                <CloseIcon
                  fontSize='small'
                  onClick={toggleOpenNewCardForm}
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column
