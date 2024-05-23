/* eslint-disable indent */
import { createNewCardAPI } from '@/apis/cards.api'
import { archiveAllCardAPI, deleteColumnAPI, updateColumnAPI } from '@/apis/columns.api'
import ConfirmationPopover from '@/components/ConfirmationPopover/ConfirmationPopover'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import DragHandleOutlinedIcon from '@mui/icons-material/DragHandleOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SortIcon from '@mui/icons-material/Sort'
import { Button, IconButton, Popover, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ListCards from '../../ListCards/ListCards'
import { toast } from 'react-toastify'
import { fetchBoardDetailsAPI } from '@/apis/boards.api'

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
  const [anchorElArchive, setAnchorElArchive] = useState(null)
  const [anchorElArchiveList, setAnchorElArchiveList] = useState(null)
  const [anchorElRemoveList, setAnchorElRemoveList] = useState(null)
  const [anchorElSort, setAnchorElSort] = useState(null)

  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => {
    setAnchorEl(null)
    setAnchorElArchive(null)
    setAnchorElSort(null)
  }

  const user = useSelector((state) => state.user.auth)

  const queryClient = useQueryClient()

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')

  const toggleOpenNewCardForm = () => {
    handleClose()
    setNewCardTitle('')
    setOpenNewCardForm(!openNewCardForm)
  }

  const mutionAddCard = useMutation({
    mutationFn: (data) => createNewCardAPI(data, user.accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const addNewcard = () => {
    if (!newCardTitle) {
      toggleOpenNewCardForm()
      return
    }

    if (newCardTitle.length < 3) {
      toast.error('Card title needs at least 5 characters')
      return
    }

    mutionAddCard.mutate({ title: newCardTitle, boardId: column.boardId, columnId: column._id })

    toggleOpenNewCardForm()
  }

  const mutionDeleteColumn = useMutation({
    mutationFn: (id) => deleteColumnAPI(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const handleDeleteColumn = () => {
    mutionDeleteColumn.mutate(column._id)
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
    mutationFn: (data) => updateColumnAPI(column._id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const editColumnTitle = () => {
    if (newColumnTitle.trim() === column.title || !newColumnTitle) {
      toggleOpenNewColumnTitleForm()
      setNewColumnTitle(column.title)
      return
    }

    mutionEditColumnTitle.mutate({
      title: newColumnTitle
    })

    toggleOpenNewColumnTitleForm()
  }

  const mutionArchiveList = useMutation({
    mutationFn: (data) => updateColumnAPI(column._id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const handleArchiveList = () => {
    mutionArchiveList.mutate({
      _destroy: true
    })
  }

  const mutionArchiveAllCardInList = useMutation({
    mutationFn: () => archiveAllCardAPI(column._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const handleArchiveAllCardInList = () => {
    mutionArchiveAllCardInList.mutate()
    handleClose()
  }

  const sortCardsByDueDate = (cards) => {
    const cardsWithDueDate = []
    const cardsWithoutDueDate = []

    cards.forEach((card) => {
      if (card?.dateTime?.dueDateTime) {
        cardsWithDueDate.push(card)
      } else {
        cardsWithoutDueDate.push(card)
      }
    })

    cardsWithDueDate.sort((a, b) => new Date(a?.dateTime?.dueDateTime) - new Date(b?.dateTime?.dueDateTime))

    return [...cardsWithDueDate, ...cardsWithoutDueDate]
  }

  const mutionSortCard = useMutation({
    mutationFn: (data) => updateColumnAPI(column._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast.success('Successfully sorted list')
    }
  })

  const sortCards = (option) => {
    let sorted = [...column.cards]
    switch (option) {
      case 'new':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'old':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'name':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'due':
        sorted = sortCardsByDueDate(sorted)
        break
      default:
        sorted = [...column.cards]
    }

    const newCardOrderIds = sorted?.map((card) => card._id)
    mutionSortCard.mutate({
      cardOrderIds: newCardOrderIds
    })
  }

  const handleSortOption = (option) => {
    sortCards(option)
    handleClose()
  }

  const [board, setBoard] = useState([])

  const boardQuery = useQuery({
    queryKey: ['board', column?.boardId],
    queryFn: async () => await fetchBoardDetailsAPI(column?.boardId)
  })

  useEffect(() => {
    if (boardQuery.data) {
      const boardData = boardQuery.data
      setBoard(boardData)
    }
  }, [boardQuery.data])

  const checkPermission = (member, board) => {
    if (member && board) {
      if (member._id === board.ownerId) {
        return 2
      }

      if (board.admins && board.admins.some((admin) => admin === member._id)) {
        return 2
      }

      if (board.members && board.members.some((memberId) => memberId === member._id)) {
        return 1
      }
    }

    return 0
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes}>
      <Box
        {...listeners}
        sx={{
          cursor: 'pointer',
          minWidth: '275px',
          maxWidth: '275px',
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
              data-no-dnd
              id='basic-menu-column-dropdown'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
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
              <Divider />

              <MenuItem
                onClick={(event) => {
                  setAnchorElSort(event.currentTarget)
                }}
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                    '& .add-icon': {
                      color: 'primary.main'
                    }
                  }
                }}
              >
                <ListItemIcon className='add-icon'>
                  <SortIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Sort by</ListItemText>
              </MenuItem>
              <Popover
                data-no-dnd
                open={Boolean(anchorElSort)}
                anchorEl={anchorElSort}
                onClose={() => {
                  setAnchorElSort(null)
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
              >
                <Box
                  sx={{
                    width: 300,
                    p: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ marginLeft: '15px' }}></Box>
                    <Typography sx={{ fontSize: '16px' }} variant='h6'>
                      Sort list
                    </Typography>
                    <IconButton
                      sx={{ p: 0 }}
                      onClick={() => {
                        setAnchorElSort(null)
                      }}
                      aria-label='delete'
                    >
                      <ClearOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Box>

                  <List>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ p: 1 }} onClick={() => handleSortOption('new')}>
                        <ListItemText primary='Date created (newest first)' />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ p: 1 }} onClick={() => handleSortOption('old')}>
                        <ListItemText primary='Date created (oldest first)' />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ p: 1 }} onClick={() => handleSortOption('name')}>
                        <ListItemText primary='Card name (alphabetically)' />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ p: 1 }} onClick={() => handleSortOption('due')}>
                        <ListItemText primary='Due Date' />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
              </Popover>
              <Divider />

              <MenuItem
                onClick={(event) => {
                  setAnchorElArchive(event.currentTarget)
                }}
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                    '& .add-icon': {
                      color: 'primary.main'
                    }
                  }
                }}
              >
                <ListItemIcon className='add-icon'>
                  <ArchiveOutlinedIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Archive all cards in this list</ListItemText>
              </MenuItem>

              <ConfirmationPopover
                title='Archive all cards in this list?'
                description='This will remove all the cards in this list from the board. To view archived cards and bring them back to the board, click “Menu” > “Archived Items.”'
                open={Boolean(anchorElArchive)}
                anchorEl={anchorElArchive}
                handleClose={() => {
                  setAnchorElArchive(null)
                }}
                onConfirm={handleArchiveAllCardInList}
                button='Archive all'
              />

              <MenuItem
                onClick={(event) => {
                  setAnchorElArchiveList(event.currentTarget)
                }}
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                    '& .add-icon': {
                      color: 'primary.main'
                    }
                  }
                }}
              >
                <ListItemIcon className='add-icon'>
                  <Inventory2OutlinedIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Archive this list</ListItemText>
              </MenuItem>

              <ConfirmationPopover
                title='Archive list and all cards in this list?'
                description='This will remove list and all the cards in this list from the board. To view archived list cards and bring them back to the board, click “Menu” > “Archived Items.”'
                open={Boolean(anchorElArchiveList)}
                anchorEl={anchorElArchiveList}
                handleClose={() => {
                  setAnchorElArchiveList(null)
                }}
                onConfirm={handleArchiveList}
                button='Archive list'
              />

              {checkPermission(user, board) !== 1 && (
                <>
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
                    onClick={(event) => {
                      setAnchorElRemoveList(event.currentTarget)
                    }}
                  >
                    <ListItemIcon className='delete-icon'>
                      <DeleteOutlineOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Remove this list</ListItemText>
                  </MenuItem>
                </>
              )}

              <ConfirmationPopover
                title='Remove list?'
                description='This action will delete the column and the cards inside! Are you sure!”'
                open={Boolean(anchorElRemoveList)}
                anchorEl={anchorElRemoveList}
                handleClose={() => {
                  setAnchorElRemoveList(null)
                }}
                onConfirm={handleDeleteColumn}
                button='Remove'
              />
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
                  onClick={() => setOpenNewCardForm(false)}
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
