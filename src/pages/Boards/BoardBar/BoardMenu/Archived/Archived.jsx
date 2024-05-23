import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { Button, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBoardArchiveCardAndListAPI } from '@/apis/boards.api'
import ReplayIcon from '@mui/icons-material/Replay'
import { updateColumnAPI } from '@/apis/columns.api'
import { toast } from 'react-toastify'
import { deleteCardAPI, updateCardAPI } from '@/apis/cards.api'
import CardArchive from './CardArchive/CardArchive'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import ConfirmationPopover from '@/components/ConfirmationPopover/ConfirmationPopover'
import { useSelector } from 'react-redux'

const Archive = ({ handleChangeContent, handleClose, board }) => {
  const [cardsArchive, setCardsArchive] = useState([])
  const [listsArchive, setListsArchive] = useState([])
  const [modeArchive, setModeArchive] = useState('cards')
  const [anchorElRemoveCard, setAnchorElRemoveCard] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  const user = useSelector((state) => state.user.auth)

  const { id } = useParams()

  const boardQuery = useQuery({ queryKey: ['boardArchive', id], queryFn: () => fetchBoardArchiveCardAndListAPI(id) })

  useEffect(() => {
    if (boardQuery.data) {
      const boardData = boardQuery.data

      const filteredCards = boardData?.cards.filter((card) =>
        board.columns.find((column) => column._id === card.columnId)
      )

      setCardsArchive(filteredCards)
      setListsArchive(boardData?.lists)
    }
  }, [boardQuery.data, board])

  const queryClient = useQueryClient()

  const mutionSendToBoardList = useMutation({
    mutationFn: (data) => updateColumnAPI(data.columnId, data.dataUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      queryClient.invalidateQueries({ queryKey: ['boardArchive'] })
      toast.success('Send list to board successfully!')
    }
  })

  const handleSendToBoardList = (columnId) => {
    mutionSendToBoardList.mutate({
      columnId: columnId,
      dataUpdate: {
        _destroy: false
      }
    })
  }

  const mutionSendToBoardCard = useMutation({
    mutationFn: (data) => updateCardAPI(data.cardId, data.dataUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      queryClient.invalidateQueries({ queryKey: ['boardArchive'] })
      toast.success('Send card to board successfully!')
    }
  })

  const handleSendToBoardCard = (cardId) => {
    mutionSendToBoardCard.mutate({
      cardId: cardId,
      dataUpdate: {
        _destroy: false
      }
    })
  }

  const mutionDeleteCard = useMutation({
    mutationFn: (id) => deleteCardAPI(id, user?.accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['boardArchive'] })
  })

  const handleDeleteCard = (cardId) => {
    mutionDeleteCard.mutate(cardId)
  }

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value)
  }

  const filteredCards = cardsArchive?.filter((card) => card.title.toLowerCase().includes(searchInput.toLowerCase()))

  const filteredLists = listsArchive?.filter((list) => list.title.toLowerCase().includes(searchInput.toLowerCase()))

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
    <Box sx={{ width: 370, p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton
          onClick={() => {
            handleChangeContent('menu')
          }}
          aria-label='delete'
        >
          <ArrowBackIosIcon fontSize='small' sx={{ fontSize: '14px' }} />
        </IconButton>
        <Typography sx={{ fontSize: '16px' }} variant='h6'>
          Archive
        </Typography>
        <IconButton onClick={handleClose} aria-label='delete'>
          <ClearOutlinedIcon fontSize='small' />
        </IconButton>
      </Box>

      <Divider sx={{ m: 1 }} />

      <Box sx={{ height: 650, overflow: 'auto' }}>
        {modeArchive === 'cards' ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                type='search'
                variant='outlined'
                size='small'
                placeholder='Search archive...'
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <Button onClick={() => setModeArchive('lists')} variant='outlined'>
                Archived lists
              </Button>
            </Box>
            {!filteredCards?.length && (
              <Box
                sx={{
                  height: 50,
                  width: '97%',
                  bgcolor: '#091e420f',
                  borderRadius: '2px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 2
                }}
              >
                No archived cards
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              {filteredCards?.map((card, index) => (
                <>
                  <Box key={card._id} sx={{ mt: 1, mb: 1, p: '0 25px 0 25px' }}>
                    <CardArchive card={card} />
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Button
                        sx={{ mr: 1 }}
                        onClick={() => handleSendToBoardCard(card._id)}
                        startIcon={<ReplayIcon />}
                        variant='outlined'
                      >
                        Send to board
                      </Button>
                      {checkPermission(user, board) !== 1 && (
                        <Button
                          color='error'
                          onClick={(event) => {
                            setAnchorElRemoveCard(event.currentTarget)
                          }}
                          startIcon={<DeleteOutlineOutlinedIcon />}
                          variant='outlined'
                        >
                          Delete
                        </Button>
                      )}
                    </Box>
                    {index !== filteredCards?.length - 1 && <Divider sx={{ bgcolor: '#091e420f' }} />}
                  </Box>
                  <ConfirmationPopover
                    title='Delete card?'
                    description='All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no undo.'
                    open={Boolean(anchorElRemoveCard)}
                    anchorEl={anchorElRemoveCard}
                    handleClose={() => {
                      setAnchorElRemoveCard(null)
                    }}
                    onConfirm={() => handleDeleteCard(card._id)}
                    button='Remove'
                  />
                </>
              ))}
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TextField
                type='search'
                variant='outlined'
                size='small'
                placeholder='Search archive...'
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <Button onClick={() => setModeArchive('cards')} variant='outlined'>
                Archived cards
              </Button>
            </Box>
            {!filteredLists?.length && (
              <Box
                sx={{
                  height: 50,
                  width: '100%',
                  bgcolor: '#091e420f',
                  borderRadius: '2px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 2
                }}
              >
                No archived lists
              </Box>
            )}
            {filteredLists?.map((list, index) => (
              <>
                <Box
                  key={list._id}
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between', mt: 1, mb: 1 }}
                >
                  <Typography variant='body' sx={{ fontSize: '16px' }}>
                    {list?.title}
                  </Typography>
                  <Button onClick={() => handleSendToBoardList(list._id)} startIcon={<ReplayIcon />} variant='outlined'>
                    Send to board
                  </Button>
                </Box>
                {index !== filteredLists?.length - 1 && <Divider sx={{ bgcolor: '#091e420f' }} />}
              </>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Archive
