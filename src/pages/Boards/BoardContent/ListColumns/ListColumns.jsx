import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNewColumnAPI } from '@/apis/columns.api'

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
      toggleOpenNewColumnForm()
      return
    }

    mutionAddColumn.mutate(
      { title: newColumnTitle, boardId: boardId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['board'] })
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
          <Column key={column._id} column={column} />
        ))}

        {!openNewColumnForm ? (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#576574' : '#dfe6e9')
            }}
            onClick={toggleOpenNewColumnForm}
          >
            <Button
              sx={{
                color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2,
                py: 1
              }}
              startIcon={<AddIcon />}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            as='form'
            onSubmit={(e) => {
              e.preventDefault()
              addNewColumn()
            }}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#576574' : '#dfe6e9'),
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <TextField
              placeholder='Enter column title...'
              type='text'
              autoFocus
              onBlur={addNewColumn}
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              size='small'
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button type='submit' sx={{ boxShadow: 'none' }} variant='contained' size='small'>
                Add Column
              </Button>
              <CloseIcon
                fontSize='small'
                onClick={toggleOpenNewColumnForm}
                sx={{
                  color: 'black',
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
