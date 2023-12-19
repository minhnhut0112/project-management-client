import { Box, Checkbox, Grid, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarRateIcon from '@mui/icons-material/StarRate'
import { useState } from 'react'

const Boards = () => {
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)

  const handleGridClick = (event) => {
    if (!event.target.closest('input[type="checkbox"]')) {
      navigate('/board')
    }
  }

  const handleCheckboxClick = () => {
    setChecked(!checked)
  }

  return (
    <Box sx={{ padding: '10px 0px 10px 0px', width: { xs: 250, md: 1000 }, mx: 3 }}>
      <Typography variant='h6' sx={{ color: 'white' }}>
        YOUR WORKSPACES
      </Typography>
      <Grid container sx={{ gap: 2 }}>
        <Grid
          sx={{
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),

            height: 100,
            padding: 3,
            cursor: 'pointer',
            mt: 3,
            borderRadius: '3px'
          }}
          item
          xs={6}
          md={3}
          onClick={handleGridClick}
        >
          <Typography>Minh Nhut</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Checkbox
              icon={<StarBorderIcon />}
              checked={checked}
              onClick={handleCheckboxClick}
              checkedIcon={<StarRateIcon sx={{ color: '#f9ca24' }} />}
            />
          </Box>
        </Grid>
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'center',
            bgcolor: '#ffffff3d',
            mt: 3
          }}
          item
          xs={6}
          md={3}
        >
          <Button sx={{ color: 'white', width: '100%' }}>Add new column</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Boards
