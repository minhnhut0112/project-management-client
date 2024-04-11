import { isColorLight } from '@/utils/formatters'
import { Avatar, Box } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import dayjs from 'dayjs'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'

export default function BasicTable({ board }) {
  function createData(card, list, labels, members, dueDate) {
    return { card, list, labels, members, dueDate }
  }

  const rows = []

  function extractDataFromBoard(board) {
    board.columns.forEach((column) => {
      column.cards.forEach((card) => {
        const labels = (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {card.labels.map((label, index) => (
              <Box
                key={index}
                sx={{
                  minWidth: '70px',
                  bgcolor: `${label.bgColor}`,
                  height: '32px',
                  p: '0 12px',
                  borderRadius: ' 3px',
                  display: 'flex',
                  alignItems: 'center',
                  color: isColorLight(label.bgColor) ? 'black' : 'white'
                }}
              >
                {label.labelTitle}
              </Box>
            ))}
          </Box>
        )

        const membersAvatars = (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {card.members.map((member, index) => (
              <Avatar
                key={index}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: member?.avatarColor
                }}
                src={member?.avatar}
              >
                {member?.username?.charAt(0)?.toUpperCase()}
              </Avatar>
            ))}
          </Box>
        )

        const currentDateTime = dayjs()
        const isOverdue = currentDateTime.isAfter(card?.dateTime?.dueDateTime)
        const isComplete = card?.completed

        let bgColor = ''
        let color = ''
        if (isComplete) {
          bgColor = '#1f845a'
          color = 'white'
        } else if (isOverdue) {
          bgColor = '#ffeceb'
          color = '#ae2e24'
        }

        const dateTime = (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: bgColor,
              color: color,
              borderRadius: '3px',
              p: 1,
              height: '30px',
              fontSize: '12px',
              width: 'fit-content'
            }}
          >
            {card.dateTime && (
              <>
                <AccessTimeOutlinedIcon sx={{ fontSize: '16px', mr: 0.5 }} />
                <Box>
                  {dayjs(card?.dateTime?.startDateTime).format('MMM D')} -{' '}
                  {dayjs(card?.dateTime?.dueDateTime).format('MMM D')}
                </Box>
              </>
            )}
          </Box>
        )

        rows.push(createData(card?.title, column?.title, labels, membersAvatars, dateTime))
      })
    })
  }

  extractDataFromBoard(board)

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#ffffff',
        overflow: 'auto',
        borderRadius: '5px',
        p: 1
      }}
    >
      <TableContainer component={Paper} sx={{ borderRadius: 'none', boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }} aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell>Card</TableCell>
              <TableCell>List</TableCell>
              <TableCell>Labels</TableCell>
              <TableCell>Members</TableCell>
              <TableCell>Due date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell component='th' scope='row'>
                  {row.card}
                </TableCell>
                <TableCell>{row.list}</TableCell>
                <TableCell>{row.labels}</TableCell>
                <TableCell>{row.members}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
