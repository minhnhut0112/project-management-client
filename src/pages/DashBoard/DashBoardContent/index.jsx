import { nameByColor } from '@/utils/constants'
import { Grid, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { BarChart } from '@mui/x-charts/BarChart'
import dayjs from 'dayjs'

export default function BasicBars({ board }) {
  const cardPerList = []
  const columnsTitle = []

  const renderCardPerList = () => {
    board.columns.map((column) => {
      columnsTitle.push(column.title)
      cardPerList.push(column.cards.length)
    })
  }

  renderCardPerList()

  const cardPerDueDate = [0, 0, 0, 0]
  const dueDateStatus = ['Complete', 'Due later', 'Overdue', 'No due date']

  const rendercardPerDueDate = () => {
    board.columns.forEach((column) => {
      column.cards.forEach((card) => {
        const dueDateTime = dayjs(card?.dateTime?.dueDateTime)
        const currentDateTime = dayjs()
        const isOverdue = currentDateTime.isAfter(dueDateTime)
        const isComplete = card?.completed

        if (isComplete) {
          cardPerDueDate[0]++
        } else if (isOverdue) {
          cardPerDueDate[2]++
        } else if (!card?.dateTime?.dueDateTime) {
          cardPerDueDate[3]++
        } else {
          cardPerDueDate[1]++
        }
      })
    })
  }

  rendercardPerDueDate()

  const cardPerMember = []
  const memberUsername = []

  const renderCardPerMember = () => {
    board.userInBoard.forEach((user) => {
      memberUsername.push(user.username)
    })

    memberUsername.push('Unassigned')

    memberUsername.forEach((username) => {
      cardPerMember.push({ username: username, count: 0 })
    })

    board.columns.forEach((column) => {
      column.cards.forEach((card) => {
        if (card.members.length === 0) {
          const unassignedIndex = cardPerMember.findIndex((item) => item.username === 'Unassigned')
          cardPerMember[unassignedIndex].count++
        } else {
          card.members.forEach((member) => {
            const memberIndex = cardPerMember.findIndex((item) => item.username === member.username)
            if (memberIndex !== -1) {
              cardPerMember[memberIndex].count++
            }
          })
        }
      })
    })
  }

  renderCardPerMember()

  const getFullNameByUsername = (username) => {
    const user = board.userInBoard.find((user) => user.username === username)
    return user ? user.fullname : username
  }

  const cardPerLabel = []
  let labelIds = []

  const renderCardPerLabel = () => {
    board.labels.forEach((label) => {
      const labelId = label._id
      labelIds.push(labelId)
      cardPerLabel.push({ labelId: labelId, count: 0 })
    })

    board.columns.forEach((column) => {
      column.cards.forEach((card) => {
        card.labels.forEach((label) => {
          const labelIndex = cardPerLabel.findIndex((item) => item.labelId === label._id)
          if (labelIndex !== -1) {
            cardPerLabel[labelIndex].count++
          }
        })
      })
    })

    labelIds = labelIds.filter((labelId) => {
      return cardPerLabel.some((item) => item.labelId === labelId && item.count > 0)
    })
  }
  renderCardPerLabel()

  const getLabelNameById = (labelId) => {
    const label = board.labels.find((label) => label._id === labelId)
    return label.labelTitle ? label.labelTitle : getColorName(label.bgColor)
  }

  function getColorName(hexColor) {
    const colorObj = nameByColor.find((color) => color.color === hexColor.toLowerCase())

    return colorObj ? colorObj.name : 'Unknown'
  }

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#ecf0f1',
        overflow: 'auto',
        borderRadius: '5px',
        p: 2
      }}
    >
      <Grid container spacing={3}>
        <Grid item md={6}>
          <Box sx={{ bgcolor: '#ffffff', borderRadius: '5px', p: 2 }}>
            <Typography variant='h6' sx={{ fontSize: '18px' }}>
              Card per list
            </Typography>
            {!!cardPerList.length && !!columnsTitle.length ? (
              <BarChart
                height={490}
                series={[{ data: cardPerList, color: '#54a0ff' }]}
                xAxis={[{ data: columnsTitle, scaleType: 'band' }]}
              />
            ) : (
              <Box sx={{ height: 490 }}>No data</Box>
            )}
          </Box>
        </Grid>
        <Grid item md={6}>
          <Box sx={{ bgcolor: '#ffffff', borderRadius: '5px', p: 2 }}>
            <Typography variant='h6' sx={{ fontSize: '18px' }}>
              Card per due date
            </Typography>
            {!!cardPerDueDate.length && !!dueDateStatus.length ? (
              <BarChart
                height={490}
                series={[{ data: cardPerDueDate }]}
                xAxis={[{ data: dueDateStatus, scaleType: 'band' }]}
              />
            ) : (
              <Box sx={{ height: 490 }}>No data</Box>
            )}
          </Box>
        </Grid>
        <Grid item md={6}>
          <Box sx={{ bgcolor: '#ffffff', borderRadius: '5px', p: 2 }}>
            <Typography variant='h6' sx={{ fontSize: '18px' }}>
              Card per member
            </Typography>
            {!!cardPerMember.length && !!memberUsername.length ? (
              <BarChart
                height={490}
                series={[{ data: cardPerMember.map((s) => s.count), color: '#273c75' }]}
                xAxis={[{ data: memberUsername.map((username) => getFullNameByUsername(username)), scaleType: 'band' }]}
              />
            ) : (
              <Box sx={{ height: 490 }}>No data</Box>
            )}
          </Box>
        </Grid>
        <Grid item md={6}>
          <Box sx={{ bgcolor: '#ffffff', borderRadius: '5px', p: 2 }}>
            <Typography variant='h6' sx={{ fontSize: '18px' }}>
              Card per label
            </Typography>
            {!!cardPerLabel.length && !!labelIds.length ? (
              <BarChart
                height={490}
                series={[{ data: cardPerLabel.map((s) => s.count), color: '#81ecec' }]}
                xAxis={[{ data: labelIds.map((label) => getLabelNameById(label)), scaleType: 'band' }]}
              />
            ) : (
              <Box sx={{ height: 490 }}>No data</Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
