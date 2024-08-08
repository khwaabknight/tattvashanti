import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from '@mui/material'
import DietChart from './DietChart'
import api from '../utils/axiosConfig'
import { useNavigate } from 'react-router-dom'

const DietCharts = () => {
  const [openDietChart, setOpenDietChart] = useState(false)
  const [cuisines, setCuisines] = useState([])
  const [dishes, setDishes] = useState([])
  const [selectedCuisine, setSelectedCuisine] = useState('')
  const [selectedDeficit, setSelectedDeficit] = useState('')
  const [selectedDishes, setSelectedDishes] = useState([])
  const [calories, setCalories] = useState('')
  const [servingSize, setServingSize] = useState('')
  const [dietChartData, setDietChartData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCuisines()
    fetchDishes()
  }, [])

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

  const fetchDishes = async () => {
    try {
      const response = await api.get('/api/v1/dish')
      if (response.data && Array.isArray(response.data.data)) {
        setDishes(response.data.data)
      } else {
        console.error('Unexpected dish data structure:', response.data)
        setDishes([])
      }
    } catch (error) {
      console.error('Error fetching dishes:', error)
      if (error.response && error.response.status === 401) {
        navigate('/login')
      }
    }
  }

  const handleCreateDietChart = async () => {
    if (
      !selectedCuisine ||
      !selectedDeficit ||
      selectedDishes.length === 0 ||
      !calories ||
      !servingSize
    ) {
      console.error('All fields are required')
      return
    }

    const requestData = {
      cuisine: selectedCuisine,
      deficitCaloriesLevel: selectedDeficit,
      items: [
        {
          dishes: selectedDishes,
          calories: parseInt(calories),
          servingSize: parseInt(servingSize),
        },
      ],
    }

    try {
      const baseDietChartResponse = await api.post(
        '/api/v1/baseDietChart',
        requestData
      )

      // Log the entire response to understand its structure
      console.log('Base Diet Chart Response:', baseDietChartResponse)

      if (baseDietChartResponse.data && baseDietChartResponse.data.dietChart) {
        const dietChartData = baseDietChartResponse.data.dietChart

        // Transform the diet chart data for display
        const items = dietChartData.items.map((item) => ({
          id: item,
          name:
            dishes.find((dish) => dish._id === item)?.name || 'Unknown Dish', // Find dish name
          calories: calories, // Assuming you set calories for all items uniformly
          servingSize: servingSize, // Assuming serving size is uniform
        }))

        // Simulate daily diet chart data
        const dietChart = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ].reduce((acc, day) => {
          acc[day] = items
          return acc
        }, {})

        setDietChartData(dietChart)
        setOpenDietChart(true)
      } else {
        console.error(
          'Base diet chart creation failed. The response data does not contain the expected fields.'
        )
        console.error('Response Data:', baseDietChartResponse.data)
      }
    } catch (error) {
      console.error('Error creating diet chart:', error)
    }
  }

  const handleCloseDietChart = () => {
    setOpenDietChart(false)
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4 }}>
      <Typography
        variant='h4'
        gutterBottom
        sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}
      >
        Create Diet Chart
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Cuisine</InputLabel>
              <Select
                value={selectedCuisine}
                label='Cuisine'
                onChange={(e) => setSelectedCuisine(e.target.value)}
              >
                {cuisines.map((cuisine) => (
                  <MenuItem key={cuisine._id} value={cuisine._id}>
                    {cuisine.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Deficit</InputLabel>
              <Select
                value={selectedDeficit}
                label='Deficit'
                onChange={(e) => setSelectedDeficit(e.target.value)}
              >
                <MenuItem value='L1'>L1</MenuItem>
                <MenuItem value='L2'>L2</MenuItem>
                <MenuItem value='L3'>L3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Dishes</InputLabel>
              <Select
                multiple
                value={selectedDishes}
                label='Dishes'
                onChange={(e) => setSelectedDishes(e.target.value)}
              >
                {dishes.map((dish) => (
                  <MenuItem key={dish._id} value={dish._id}>
                    {dish.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              sx={{ mb: 2 }}
              label='Calories'
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              type='number'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              sx={{ mb: 2 }}
              label='Serving Size'
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
              type='number'
            />
          </Grid>
        </Grid>
        <Button
          variant='contained'
          color='primary'
          onClick={handleCreateDietChart}
          disabled={
            !selectedCuisine ||
            !selectedDeficit ||
            selectedDishes.length === 0 ||
            !calories ||
            !servingSize
          }
          sx={{ mt: 2 }}
        >
          Generate Diet Chart
        </Button>
      </Paper>
      <Dialog
        open={openDietChart}
        onClose={handleCloseDietChart}
        maxWidth='lg'
        fullWidth
      >
        <DialogTitle>Generated Diet Chart</DialogTitle>
        <DialogContent>
          {dietChartData && (
            <Box>
              {Object.keys(dietChartData).map((day) => (
                <Box key={day} sx={{ mb: 2 }}>
                  <Typography variant='h6'>{day}</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Dish</TableCell>
                        <TableCell>Calories</TableCell>
                        <TableCell>Serving Size</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dietChartData[day].map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.calories}</TableCell>
                          <TableCell>{item.servingSize}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDietChart} color='primary'>
            Close
          </Button>
          <Button
            onClick={handleCloseDietChart}
            color='primary'
            variant='contained'
          >
            Save Diet Chart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default DietCharts
