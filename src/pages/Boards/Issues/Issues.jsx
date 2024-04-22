import Box from '@mui/material/Box'
import { useState } from 'react'
import AllIssue from './AllIssue/AllIssue'
import NewIssue from './NewIssue/NewIssue'
import IssueDetails from './IssueDetails/IssueDetails'

export default function Issues({ board }) {
  const [index, setIndex] = useState(0)
  const [issueDetail, setIssueDetails] = useState(null)

  const handleClickDetails = (data) => {
    setIssueDetails(data)
  }

  const handleChangeIndex = (value) => {
    setIndex(value)
  }
  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#ffffff',
        overflow: 'auto',
        borderRadius: '5px',
        p: '40px 150px 40px 150px'
      }}
    >
      <Box>
        {index === 0 && (
          <AllIssue handleChangeIndex={handleChangeIndex} board={board} handleClickDetails={handleClickDetails} />
        )}
        {index === 1 && <NewIssue handleChangeIndex={handleChangeIndex} board={board} />}
        {index === 2 && <IssueDetails handleChangeIndex={handleChangeIndex} board={board} issue={issueDetail} />}
      </Box>
    </Box>
  )
}
