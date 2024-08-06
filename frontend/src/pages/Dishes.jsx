import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import api from '../utils/axiosConfig'

const Dishes = () => {
  const [dishes, setDishes] = useState([])
  const [cuisines, setCuisines] = useState([])
  const [newDish, setNewDish] = useState({
    name: '',
    cuisine: '',
    tags: '',
    caloriesPer100gram: '',
    ingredients: '',
  })
  const [selectedCuisineId, setSelectedCuisineId] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingDish, setEditingDish] = useState(null)

  useEffect(() => {
    fetchDishes()
    fetchCuisines()
  }, [])

  const fetchDishes = async () => {
    try {
      const response = await api.get('/api/v1/dish')
      setDishes(response.data.data || [])
    } catch (error) {
      console.error('Error fetching dishes:', error)
      setDishes([])
    }
  }

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
      setCuisines([])
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewDish({ ...newDish, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dishData = {
        name: newDish.name,
        cuisine: selectedCuisineId, // Use the ObjectId of the selected cuisine
        tags: newDish.tags.split(',').map((tag) => tag.trim()),
        caloriesPer100gram: parseInt(newDish.caloriesPer100gram, 10),
        ingredients: newDish.ingredients
          .split(',')
          .map((ingredient) => ingredient.trim()),
      }

      console.log('Posting dish data:', dishData)

      await api.post('/api/v1/dish', dishData)
      setNewDish({
        name: '',
        cuisine: '',
        tags: '',
        caloriesPer100gram: '',
        ingredients: '',
      })
      setSelectedCuisineId('') // Reset selected cuisine ID
      fetchDishes()
    } catch (error) {
      console.error('Error creating dish:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/v1/dish/${id}`)
      fetchDishes() // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting dish:', error)
    }
  }

  const handleEdit = (dish) => {
    setEditingDish(dish)
    setOpenDialog(true)
  }

  const handleUpdateDish = async (id) => {
    try {
      await api.put(`/api/v1/dish/${id}`, editingDish)
      setOpenDialog(false)
      fetchDishes()
    } catch (error) {
      console.error('Error updating dish:', error)
    }
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4 }}>
      <Typography
        variant='h4'
        gutterBottom
        sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}
      >
        Dish Management
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label='Dish Name'
              name='name'
              value={newDish.name}
              onChange={handleInputChange}
              margin='normal'
            />
            <FormControl fullWidth margin='normal'>
              <InputLabel>Cuisine</InputLabel>
              <Select
                name='cuisine'
                value={selectedCuisineId}
                onChange={(e) => setSelectedCuisineId(e.target.value)}
              >
                {cuisines.map((cuisine) => (
                  <MenuItem key={cuisine._id} value={cuisine._id}>
                    {cuisine.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label='Tags (comma-separated)'
              name='tags'
              value={newDish.tags}
              onChange={handleInputChange}
              margin='normal'
            />
            <TextField
              fullWidth
              label='Calories per 100g'
              name='caloriesPer100gram'
              type='number'
              value={newDish.caloriesPer100gram}
              onChange={handleInputChange}
              margin='normal'
            />
            <TextField
              fullWidth
              label='Ingredients (comma-separated)'
              name='ingredients'
              value={newDish.ingredients}
              onChange={handleInputChange}
              margin='normal'
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Dish
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {dishes.map((dish) => (
              <Grid item xs={12} sm={6} md={4} key={dish._id}>
                <Card>
                  <CardContent>
                    <Typography variant='h6' component='div'>
                      {dish.name}
                    </Typography>
                    <Typography color='textSecondary' gutterBottom>
                      Calories: {dish.caloriesPer100gram} per 100g
                    </Typography>
                    <Typography variant='body2' component='p'>
                      Ingredients: {dish.ingredients.join(', ')}
                    </Typography>
                    <div style={{ marginTop: 8 }}>
                      {dish.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size='small'
                          style={{ marginRight: 4, marginBottom: 4 }}
                        />
                      ))}
                    </div>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      aria-label='edit'
                      onClick={() => handleEdit(dish)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label='delete'
                      onClick={() => handleDelete(dish._id)}
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

      {/* Dialog for editing a dish */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Dish</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='Dish Name'
            value={editingDish?.name || ''}
            onChange={(e) =>
              setEditingDish({ ...editingDish, name: e.target.value })
            }
            margin='normal'
          />
          <FormControl fullWidth margin='normal'>
            <InputLabel>Cuisine</InputLabel>
            <Select
              value={editingDish?.cuisine || ''}
              onChange={(e) =>
                setEditingDish({ ...editingDish, cuisine: e.target.value })
              }
            >
              {cuisines.map((cuisine) => (
                <MenuItem key={cuisine._id} value={cuisine._id}>
                  {cuisine.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label='Tags (comma-separated)'
            value={editingDish?.tags.join(', ') || ''}
            onChange={(e) =>
              setEditingDish({
                ...editingDish,
                tags: e.target.value.split(',').map((tag) => tag.trim()),
              })
            }
            margin='normal'
          />
          <TextField
            fullWidth
            label='Calories per 100g'
            type='number'
            value={editingDish?.caloriesPer100gram || ''}
            onChange={(e) =>
              setEditingDish({
                ...editingDish,
                caloriesPer100gram: e.target.value,
              })
            }
            margin='normal'
          />
          <TextField
            fullWidth
            label='Ingredients (comma-separated)'
            value={editingDish?.ingredients.join(', ') || ''}
            onChange={(e) =>
              setEditingDish({
                ...editingDish,
                ingredients: e.target.value
                  .split(',')
                  .map((ingredient) => ingredient.trim()),
              })
            }
            margin='normal'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => handleUpdateDish(editingDish._id)}
            color='primary'
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Dishes
