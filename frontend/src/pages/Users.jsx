import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import api from '../utils/axiosConfig'
import { useNavigate } from 'react-router-dom'

const Users = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [cuisines, setCuisines] = useState([])
  const [selectedCuisine, setSelectedCuisine] = useState('')
  const [selectedDeficit, setSelectedDeficit] = useState('')
  const [dietChart, setDietChart] = useState(null)
  const [showDietChart, setShowDietChart] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
    fetchCuisines()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/v1/user')
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users)
      } else {
        console.error('Unexpected data structure:', response.data)
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      if (error.response && error.response.status === 401) {
        navigate('/login')
      }
    }
  }

  const fetchCuisines = async () => {
    try {
      const response = await api.get('/api/v1/cuisine')
      if (response.data && Array.isArray(response.data.data)) {
        setCuisines(response.data.data)
      } else {
        console.error('Unexpected cuisine data structure:', response.data)
        setCuisines([])
      }
    } catch (error) {
      console.error('Error fetching cuisines:', error)
      if (error.response && error.response.status === 401) {
        navigate('/login')
      }
    }
  }

  const fetchDietChart = async (userId) => {
    try {
      const response = await api.get(`/api/v1/dietChart/${userId}`)
      console.log('API Response:', response)
      if (response.data && response.data.success) {
        const fetchedDietChart =
          response.data.dietCharts.length > 0
            ? response.data.dietCharts[0]
            : null
        console.log('Diet chart fetched:', fetchedDietChart)
        setDietChart(fetchedDietChart)
      } else {
        console.error('Failed to fetch diet chart:', response.data)
        setDietChart(null)
      }
    } catch (error) {
      console.error('Error fetching diet chart:', error)
      setDietChart(null)
    }
  }

  const handleUserClick = (user) => {
    setSelectedUser(user)
    fetchDietChart(user._id)
  }

  const handleCuisineChange = (event) => {
    setSelectedCuisine(event.target.value)
  }

  const handleDeficitChange = (event) => {
    setSelectedDeficit(event.target.value)
  }

  const assignDietChart = async () => {
    if (!selectedUser || !selectedCuisine || !selectedDeficit) {
      console.error('Please select a user, cuisine, and deficit level')
      return
    }

    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

    const dietChartData = {
      userId: selectedUser._id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      cuisine: selectedCuisine,
      deficit: selectedDeficit,
      days: [
        { day: 'Monday', meals: [] },
        { day: 'Tuesday', meals: [] },
        { day: 'Wednesday', meals: [] },
        { day: 'Thursday', meals: [] },
        { day: 'Friday', meals: [] },
        { day: 'Saturday', meals: [] },
        { day: 'Sunday', meals: [] },
      ],
    }

    try {
      const response = await api.post('/api/v1/dietChart', dietChartData)
      if (response.data && response.data.success) {
        console.log('Diet chart assigned successfully:', response.data)
        fetchDietChart(selectedUser._id)
      } else {
        console.error('Failed to assign diet chart:', response.data)
      }
    } catch (error) {
      console.error('Error assigning diet chart:', error)
    }
  }

  const toggleDietChart = () => {
    setShowDietChart(!showDietChart)
    console.log('Toggle Diet Chart:', !showDietChart)
  }

  const distributeDishesEvenly = (meals) => {
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]
    const dietChartTemplate = daysOfWeek.map((day) => ({ day, meals: [] }))

    meals.forEach((meal, index) => {
      const dayIndex = index % daysOfWeek.length
      dietChartTemplate[dayIndex].meals.push(meal)
    })

    return dietChartTemplate
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4 }}>
      <Typography
        variant='h4'
        gutterBottom
        sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}
      >
        User Management
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography
              variant='h6'
              gutterBottom
              sx={{ mb: 2, fontWeight: 'bold' }}
            >
              User List
            </Typography>
            <List>
              {users.map((user) => (
                <ListItem
                  button
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                  selected={selectedUser && selectedUser._id === user._id}
                >
                  <ListItemText primary={user.name || user.email} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedUser && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant='h6'>
                {selectedUser.name || 'User Details'}
              </Typography>
              <Typography>Email: {selectedUser.email}</Typography>
              <Typography>Age: {selectedUser.age || 'N/A'}</Typography>
              <Typography>Weight: {selectedUser.weight || 'N/A'} kg</Typography>
              <Typography>
                Health Goals: {selectedUser.healthGoals || 'N/A'}
              </Typography>

              <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                <InputLabel>Cuisine</InputLabel>
                <Select
                  value={selectedCuisine}
                  label='Cuisine'
                  onChange={handleCuisineChange}
                >
                  {cuisines.map((cuisine) => (
                    <MenuItem key={cuisine._id} value={cuisine._id}>
                      {cuisine.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                <InputLabel>Deficit</InputLabel>
                <Select
                  value={selectedDeficit}
                  label='Deficit'
                  onChange={handleDeficitChange}
                >
                  <MenuItem value='L1'>L1</MenuItem>
                  <MenuItem value='L2'>L2</MenuItem>
                  <MenuItem value='L3'>L3</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant='contained'
                color='primary'
                onClick={assignDietChart}
                disabled={!selectedCuisine || !selectedDeficit}
                sx={{ mt: 2, mb: 4 }}
              >
                Assign Diet Chart
              </Button>

              {dietChart && (
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={toggleDietChart}
                  sx={{ mt: 2, mb: 4 }}
                >
                  {showDietChart ? 'Hide Diet Chart' : 'View Diet Chart'}
                </Button>
              )}

              {showDietChart && dietChart && dietChart.days && (
                <div>
                  <Typography variant='h6' sx={{ mt: 4, mb: 2 }}>
                    Current Diet Chart
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Day</TableCell>
                          <TableCell>Meals</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {distributeDishesEvenly(dietChart.meals).map(
                          (day, index) => (
                            <TableRow key={index}>
                              <TableCell>{day.day}</TableCell>
                              <TableCell>
                                {day.meals.length > 0 ? (
                                  day.meals.map((meal, mealIndex) => (
                                    <div key={mealIndex}>
                                      <strong>{meal.type}: </strong>
                                      {meal.items.join(', ')}
                                    </div>
                                  ))
                                ) : (
                                  <div>No meals assigned</div>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Users
