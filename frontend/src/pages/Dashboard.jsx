import React from 'react'
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
  useTheme,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import PeopleIcon from '@mui/icons-material/People'

const Dashboard = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  const menuItems = [
    {
      title: 'Cuisine',
      icon: <RestaurantIcon fontSize='large' />,
      path: '/counsellor/cuisine',
    },
    {
      title: 'Dishes',
      icon: <MenuBookIcon fontSize='large' />,
      path: '/counsellor/dishes',
    },
    {
      title: 'Users',
      icon: <PeopleIcon fontSize='large' />,
      path: '/counsellor/users',
    },
  ]

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant='h4' component='h1' gutterBottom>
          Counsellor Dashboard
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              {item.icon}
              <Typography variant='h6' component='h2' sx={{ mt: 2, mb: 2 }}>
                {item.title}
              </Typography>
              <Button
                variant='contained'
                color='primary'
                onClick={() => navigate(item.path)}
                sx={{ mt: 'auto' }}
              >
                View {item.title}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Dashboard
