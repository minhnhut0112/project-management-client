import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNewColumnAPI } from '@/apis'

const ListColumns = ({ columns, boardId }) => {
  const queryClient = useQueryClient()

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
    setNewColumnTitle('')
  }

  const mutionAddColumn = useMutation({
    mutationFn: (data) => createNewColumnAPI(data)
  })

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Please enter Column title!')
      return
    }

    mutionAddColumn.mutate(
      { title: newColumnTitle, boardId: boardId },
      {
        onSuccess: () => {
          toast.success('Add column is successfully!')
          queryClient.invalidateQueries({ queryKey: ['board'] })
        },
        onError: (e) => {
          if (e.response.status === 422) {
            toast.error(`${e.response.data.message}`)
          }
        }
      }
    )

    toggleOpenNewColumnForm()
  }

  return (
    <SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': {
            m: 2
          }
        }}
      >
        {columns?.map((column) => (
          <Column key={column._id} column={column} columnId={column._id} boardId={boardId} />
        ))}

        {!openNewColumnForm ? (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
            }}
            onClick={toggleOpenNewColumnForm}
          >
            <Button
              sx={{ color: 'white', width: '100%', justifyContent: 'flex-start', pl: 2, py: 1 }}
              startIcon={<AddIcon />}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <TextField
              label='Enter column title...'
              type='text'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              size='small'
              sx={{
                '& label': {
                  color: 'white'
                },
                '& input': {
                  color: 'white'
                },
                '& label.Mui-focused': {
                  color: 'white'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button onClick={addNewColumn} sx={{ boxShadow: 'none' }} variant='contained' size='small'>
                Add Column
              </Button>
              <CloseIcon
                fontSize='small'
                onClick={toggleOpenNewColumnForm}
                sx={{
                  color: 'white',
                  cursor: 'pointer'
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
