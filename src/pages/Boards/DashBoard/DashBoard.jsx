import { BarChart } from '@mui/x-charts/BarChart'
import Box from '@mui/material/Box'
import { Grid, Typography } from '@mui/material'

export default function BasicBars() {
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
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
              series={[{ data: [4, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
              height={500}
            />
          </Box>
        </Grid>{' '}
        <Grid item md={6}>
          <Box sx={{ bgcolor: '#ffffff', borderRadius: '5px', p: 2 }}>
            <Typography variant='h6' sx={{ fontSize: '18px' }}>
              Card per due date
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
              series={[{ data: [4, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
              height={500}
            />
          </Box>
        </Grid>{' '}
        <Grid item md={6}>
          <Box sx={{ bgcolor: '#ffffff', borderRadius: '5px', p: 2 }}>
            <Typography variant='h6' sx={{ fontSize: '18px' }}>
              Card per member
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
              series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
              height={500}
            />
          </Box>
        </Grid>{' '}
        <Grid item md={6}>
          <Box sx={{ bgcolor: '#ffffff', borderRadius: '5px', p: 2 }}>
            <Typography variant='h6' sx={{ fontSize: '18px' }}>
              Card per label
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
              series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
              height={500}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
