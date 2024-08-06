import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axiosConfig'

const Cuisine = () => {
  const [newCuisineName, setNewCuisineName] = useState('')
  const [newCuisineDescription, setNewCuisineDescription] = useState('')
  const [newCuisineTags, setNewCuisineTags] = useState('')
  const [cuisines, setCuisines] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchCuisines()
  }, [])

  const fetchCuisines = async () => {
    try {
      const response = await api.get('/api/v1/cuisine')
      if (response.data && Array.isArray(response.data.data)) {
        setCuisines(response.data.data)
      } else {
        console.error('Unexpected data structure:', response.data)
        setCuisines([])
      }
    } catch (error) {
      console.error('Error fetching cuisines:', error)
      if (error.response && error.response.status === 401) {
        navigate('/login')
      }
    }
  }

  const handleAddCuisine = async () => {
    try {
      const tagsArray = newCuisineTags.split(',').map((tag) => tag.trim())
      await api.post('/api/v1/cuisine', {
        name: newCuisineName,
        description: newCuisineDescription,
        tags: tagsArray,
      })
      setNewCuisineName('')
      setNewCuisineDescription('')
      setNewCuisineTags('')
      fetchCuisines()
    } catch (error) {
      console.error('Error adding cuisine:', error)
      if (error.response && error.response.status === 401) {
        navigate('/login')
      }
    }
  }

  const handleDeleteCuisine = async (id) => {
    try {
      await api.delete(`/api/v1/cuisine/${id}`)
      fetchCuisines() // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting cuisine:', error)
      if (error.response && error.response.status === 401) {
        navigate('/login')
      }
    }
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4 }}>
      <Typography
        variant='h4'
        gutterBottom
        sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}
      >
        Cuisine Management
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
            <Typography
              variant='h6'
              gutterBottom
              sx={{ mb: 2, fontWeight: 'bold' }}
            >
              Add New Cuisine
            </Typography>
            <TextField
              label='Cuisine Name'
              variant='outlined'
              fullWidth
              value={newCuisineName}
              onChange={(e) => setNewCuisineName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label='Description'
              variant='outlined'
              fullWidth
              multiline
              rows={4}
              value={newCuisineDescription}
              onChange={(e) => setNewCuisineDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label='Tags (comma-separated)'
              variant='outlined'
              fullWidth
              value={newCuisineTags}
              onChange={(e) => setNewCuisineTags(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant='contained'
              color='primary'
              onClick={handleAddCuisine}
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Cuisine
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography
            variant='h6'
            gutterBottom
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Cuisines
          </Typography>
          <Grid container spacing={2}>
            {cuisines.map((cuisine) => (
              <Grid item xs={12} sm={6} md={4} key={cuisine._id}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant='h6' component='div' align='center'>
                      {cuisine.name}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center' }}>
                    <IconButton
                      aria-label='delete'
                      onClick={() => handleDeleteCuisine(cuisine._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Cuisine
