import React, { useState } from 'react'
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined'
import { Box, Checkbox, Chip, IconButton, LinearProgress, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { updateCheckListAPI } from '@/apis/cards.api'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'

const CheckList = ({ checklist, cardId }) => {
  const [checkListState, setCheckListState] = useState(checklist)
  const [editingItem, setEditingItem] = useState(null)
  const [newItemTitle, setNewItemTitle] = useState('')
  const [showAddItemInput, setShowAddItemInput] = useState(null)

  const handleCheckboxChange = (listIndex, itemIndex) => {
    const updatedChecklist = [...checkListState]
    updatedChecklist[listIndex].items[itemIndex].checked = !updatedChecklist[listIndex].items[itemIndex].checked
    setCheckListState(updatedChecklist)
    mutionUpdateCheckList.mutate({ checklist: checkListState[listIndex] })
  }

  const handleTitleClick = (listIndex, itemIndex) => {
    setEditingItem({ listIndex, itemIndex })
    setShowAddItemInput(null)
  }

  const handleTitleChange = (event) => {
    const { value } = event.target
    const { listIndex, itemIndex } = editingItem
    const updatedChecklist = [...checkListState]
    updatedChecklist[listIndex].items[itemIndex].title = value
    setCheckListState(updatedChecklist)
  }

  const handleEditTitleCheckListItem = (listIndex) => {
    mutionUpdateCheckList.mutate(
      { checklist: checkListState[listIndex] },
      {
        onSuccess: () => setEditingItem(null)
      }
    )
  }

  const handleAddItem = (listIndex) => {
    const updatedChecklist = [...checkListState]
    updatedChecklist[listIndex].items.push({
      title: newItemTitle,
      checked: false
    })
    setCheckListState(updatedChecklist)
    setNewItemTitle('')
    setShowAddItemInput(null)
    mutionUpdateCheckList.mutate({ checklist: updatedChecklist[listIndex] })
  }

  const mutionUpdateCheckList = useMutation({
    mutationFn: async (data) => {
      const res = await updateCheckListAPI(cardId, data)
      return res.data
    }
  })

  const calculateProgress = (items) => {
    const totalItems = items?.length
    const checkedItems = items?.filter((item) => item.checked)?.length
    return totalItems === 0 ? 0 : (checkedItems / totalItems) * 100
  }

  return (
    <Box>
      {checklist?.map((list, listIndex) => (
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
            <Box sx={{ display: 'flex', gap: 2, mb: 0.75 }}>
              <LibraryAddCheckOutlinedIcon />
              <Typography variant='h6' sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                {list.title}
              </Typography>
            </Box>
            <Chip
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
          </Box>
          {list.items?.length && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ minWidth: 35 }}>
                <Typography variant='body2' color='text.secondary'>
                  {`${Math.round(calculateProgress(list.items))}%`}
                </Typography>
              </Box>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant='determinate' value={calculateProgress(list.items)} />
              </Box>
            </Box>
          )}
          {list.items?.map((item, itemIndex) => (
            <Box key={itemIndex} sx={{ display: 'flex', alignItems: 'start' }}>
              <Checkbox checked={item.checked} onChange={() => handleCheckboxChange(listIndex, itemIndex)} />
              {editingItem && editingItem.listIndex === listIndex && editingItem.itemIndex === itemIndex ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <TextField
                    fullWidth
                    sx={{ mb: 1, mt: 0.5 }}
                    size='small'
                    value={checkListState[listIndex].items[itemIndex].title}
                    onChange={handleTitleChange}
                  />
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                      onClick={() => handleEditTitleCheckListItem(listIndex)}
                      sx={{ width: 'fit-content' }}
                      variant='contained'
                    >
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
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    },
                    mt: 1
                  }}
                  onClick={() => handleTitleClick(listIndex, itemIndex)}
                >
                  {item.title}
                </Box>
              )}
            </Box>
          ))}

          <Box sx={{ display: 'flex', gap: 2, mb: 0.75 }}>
            <LibraryAddCheckOutlinedIcon sx={{ color: 'transparent' }} />
            {showAddItemInput === listIndex ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                <TextField
                  fullWidth
                  size='small'
                  placeholder='Add an item'
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button onClick={() => handleAddItem(listIndex)} sx={{ width: 'fit-content' }} variant='contained'>
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
