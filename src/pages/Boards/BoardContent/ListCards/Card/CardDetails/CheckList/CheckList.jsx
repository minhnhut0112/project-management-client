import { updateCardAPI, updateCheckListAPI } from '@/apis/cards.api'
import CloseIcon from '@mui/icons-material/Close'
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined'
import { Box, Checkbox, Chip, IconButton, LinearProgress, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import ConfirmationPopover from '@/components/ConfirmationPopover/ConfirmationPopover'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'

const CheckList = ({ checklist, cardId }) => {
  const [checkListState, setCheckListState] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [editingCheckListTitle, setEditingCheckListTitle] = useState(null)
  const [newItemTitle, setNewItemTitle] = useState('')
  const [showAddItemInput, setShowAddItemInput] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)

  useEffect(() => {
    setCheckListState(checklist)
  }, [checklist])

  const calculateProgress = (items) => {
    const totalItems = items?.length
    const checkedItems = items?.filter((item) => item.checked)?.length
    return totalItems === 0 ? 0 : (checkedItems / totalItems) * 100
  }

  const handleCheckListTitleClick = (listIndex) => {
    setEditingCheckListTitle(listIndex)
    setShowAddItemInput(null)
    setEditingItem(null)
  }

  const handleCheckListTitleChange = (event) => {
    const { value } = event.target
    const listIndex = editingCheckListTitle
    const updatedChecklist = [...checkListState]
    updatedChecklist[listIndex].title = value
    setCheckListState(updatedChecklist)
  }

  const handleEditTitleCheckList = (listIndex) => {
    setEditingCheckListTitle(null)
    mutionUpdateCheckList.mutate({ checklist: checkListState[listIndex] })
  }

  const handleCheckboxChange = (listIndex, itemIndex) => {
    const updatedChecklist = [...checkListState]
    updatedChecklist[listIndex].items[itemIndex].checked = !updatedChecklist[listIndex].items[itemIndex].checked
    setCheckListState(updatedChecklist)
    mutionUpdateCheckList.mutate({ checklist: checkListState[listIndex] })
  }

  const handleTitleClick = (listIndex, itemIndex) => {
    setEditingItem({ listIndex, itemIndex })
    setShowAddItemInput(null)
    setEditingCheckListTitle(null)
  }

  const handleTitleChange = (event) => {
    const { value } = event.target
    const { listIndex, itemIndex } = editingItem
    const updatedChecklist = [...checkListState]
    updatedChecklist[listIndex].items[itemIndex].title = value
    setCheckListState(updatedChecklist)
  }

  const handleEditTitleCheckListItem = (listIndex) => {
    setEditingItem(null)
    mutionUpdateCheckList.mutate({ checklist: checkListState[listIndex] })
  }

  const handleAddItem = (listIndex) => {
    const updatedChecklist = [...checkListState]
    updatedChecklist[listIndex]?.items?.push({
      title: newItemTitle,
      checked: false
    })
    setCheckListState(updatedChecklist)
    setNewItemTitle('')
    setShowAddItemInput(null)
    mutionUpdateCheckList.mutate({ checklist: updatedChecklist[listIndex] })
  }

  const queryClient = useQueryClient()

  const mutionUpdateCheckList = useMutation({
    mutationFn: async (data) => {
      const res = await updateCheckListAPI(cardId, data)
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const mutionRemoveCheckList = useMutation({
    mutationFn: async (data) => {
      const res = await updateCardAPI(cardId, data)
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const handleConfirm = (listIndex) => {
    const updatedChecklist = [...checkListState]
    updatedChecklist.splice(listIndex, 1)

    setCheckListState(updatedChecklist)

    mutionRemoveCheckList.mutate({ checklist: updatedChecklist })
  }

  const [isHovered, setIsHovered] = useState({})

  const handleDeleteItem = (listIndex, itemIndex) => {
    const updatedChecklist = [...checkListState]
    updatedChecklist[listIndex].items.splice(itemIndex, 1)
    setCheckListState(updatedChecklist)
    mutionUpdateCheckList.mutate({ checklist: updatedChecklist[listIndex] })
  }

  return (
    <Box>
      {checkListState?.map((list, listIndex) => (
        <React.Fragment key={list?._id}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              justifyContent: 'space-between',
              mb: 1,
              mt: 1
            }}
          >
            {editingCheckListTitle === listIndex ? (
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 0.75,
                  width: '100%'
                }}
              >
                <LibraryAddCheckOutlinedIcon />
                <Box
                  as='form'
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    bgcolor: '#091e420f',
                    p: 1,
                    borderRadius: '5px'
                  }}
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleEditTitleCheckList(listIndex)
                  }}
                >
                  <TextField
                    autoComplete='false'
                    autoFocus
                    fullWidth
                    onChange={handleCheckListTitleChange}
                    value={checkListState[listIndex].title}
                    sx={{ mb: 1, mt: 0.5 }}
                    size='small'
                  />
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button type='submit' sx={{ width: 'fit-content' }} variant='contained'>
                      Save
                    </Button>
                    <IconButton onClick={() => setEditingCheckListTitle(null)} aria-label='delete'>
                      <CloseIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', gap: 2, mb: 0.75 }}>
                  <LibraryAddCheckOutlinedIcon />
                  <Typography
                    onClick={() => handleCheckListTitleClick(listIndex)}
                    variant='h6'
                    sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    {list.title}
                  </Typography>
                </Box>
                <Chip
                  onClick={(event) => {
                    setAnchorEl(event.currentTarget)
                  }}
                  clickable
                  sx={{
                    fontSize: '15px',
                    justifyContent: 'start',
                    borderRadius: '4px',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
                    border: 'none'
                  }}
                  label='Delete'
                />
                <ConfirmationPopover
                  id={open ? 'confirm-popover' : undefined}
                  title='Delete Checklist?'
                  description='Deleting a checklist is permanent and there is no way to get it back.'
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  handleClose={() => {
                    setAnchorEl(null)
                  }}
                  onConfirm={() => handleConfirm(listIndex)}
                />
              </>
            )}
          </Box>
          {!!list.items?.length && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ minWidth: 35, ml: 1 }}>
                <Typography variant='body2' color='text.secondary'>
                  {`${Math.round(calculateProgress(list.items))}%`}
                </Typography>
              </Box>
              <Box sx={{ width: '100%' }}>
                <LinearProgress
                  variant='determinate'
                  value={calculateProgress(list.items)}
                  color={calculateProgress(list.items) == 100 ? 'success' : 'primary'}
                  sx={{
                    borderRadius: '5px',
                    height: '7px',
                    width: '98%'
                  }}
                />
              </Box>
            </Box>
          )}
          {list.items?.map((item, itemIndex) => (
            <Box key={itemIndex} sx={{ display: 'flex', alignItems: 'start' }}>
              <Checkbox checked={item.checked} onChange={() => handleCheckboxChange(listIndex, itemIndex)} />
              {editingItem && editingItem.listIndex === listIndex && editingItem.itemIndex === itemIndex ? (
                <Box
                  as='form'
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    bgcolor: '#091e420f',
                    p: 1,
                    borderRadius: '5px'
                  }}
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleEditTitleCheckListItem(listIndex)
                  }}
                >
                  <TextField
                    autoFocus
                    fullWidth
                    sx={{ mb: 1, mt: 0.5 }}
                    size='small'
                    value={checkListState[listIndex].items[itemIndex].title}
                    onChange={handleTitleChange}
                  />
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button type='submit' sx={{ width: 'fit-content' }} variant='contained'>
                      Save
                    </Button>
                    <IconButton onClick={() => setEditingItem(null)} aria-label='delete'>
                      <CloseIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': {
                      bgcolor: '#091e420f',
                      borderRadius: '5px'
                    }
                  }}
                  onMouseEnter={() => setIsHovered({ listIndex, itemIndex })}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <Typography
                    sx={{
                      cursor: 'pointer',

                      p: 1,
                      mt: 0.25,
                      width: '100%',
                      textDecoration: item.checked ? 'line-through' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                    onClick={() => handleTitleClick(listIndex, itemIndex)}
                  >
                    {item.title}
                  </Typography>
                  <IconButton onClick={() => handleDeleteItem(listIndex, itemIndex)} aria-label='delete'>
                    <DeleteOutlineOutlinedIcon
                      fontSize='small'
                      sx={{
                        display:
                          isHovered?.listIndex === listIndex && isHovered?.itemIndex === itemIndex ? 'block' : 'none',
                        color: 'error.light'
                      }}
                    />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}

          <Box sx={{ display: 'flex', gap: 2, mb: 0.75 }}>
            <LibraryAddCheckOutlinedIcon sx={{ color: 'transparent' }} />
            {showAddItemInput === listIndex ? (
              <Box
                as='form'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  width: '100%',
                  bgcolor: '#091e420f',
                  p: 1,
                  borderRadius: '5px'
                }}
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAddItem(listIndex)
                }}
              >
                <TextField
                  autoFocus
                  fullWidth
                  size='small'
                  placeholder='Add an item'
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button type='submit' sx={{ width: 'fit-content' }} variant='contained'>
                    Add
                  </Button>
                  <IconButton onClick={() => setShowAddItemInput(null)} aria-label='delete'>
                    <CloseIcon fontSize='small' />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <Chip
                clickable
                onClick={() => {
                  setShowAddItemInput(listIndex)
                  setEditingItem(null)
                  setEditingCheckListTitle(null)
                }}
                sx={{
                  mt: 1,
                  fontSize: '15px',
                  justifyContent: 'start',
                  borderRadius: '4px',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
                  border: 'none'
                }}
                label='Add an item'
              />
            )}
          </Box>
        </React.Fragment>
      ))}
    </Box>
  )
}

export default CheckList
