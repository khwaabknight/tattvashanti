import React, { useState } from 'react'
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import DietChart from './DietChart'

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [openDietChart, setOpenDietChart] = useState(false)

  // Mock user data - replace this with actual data from your backend
  const users = [
    { id: 1, name: 'John Doe', age: 30, weight: 70, height: 175 },
    { id: 2, name: 'Jane Smith', age: 28, weight: 65, height: 165 },
    // Add more users as needed
  ]

  // Mock diet data - replace this with actual data or form inputs
  const dietData = [
    ['Oatmeal', 'Eggs', 'Smoothie', 'Pancakes', 'Yogurt', 'Toast', 'Cereal'],
    ['Salad', 'Sandwich', 'Soup', 'Stir fry', 'Wrap', 'Pasta', 'Burger'],
    ['Chicken', 'Fish', 'Beef', 'Tofu', 'Pork', 'Lamb', 'Vegetarian'],
    [
      'Fruit',
      'Nuts',
      'Protein bar',
      'Vegetables',
      'Cheese',
      'Hummus',
      'Popcorn',
    ],
  ]

  const handleUserClick = (user) => {
    setSelectedUser(user)
  }

  const handleOpenDietChart = () => {
    setOpenDietChart(true)
  }

  const handleCloseDietChart = () => {
    setOpenDietChart(false)
  }

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Counsellor Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper>
            <List>
              {users.map((user) => (
                <ListItem
                  button
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  selected={selectedUser && selectedUser.id === user.id}
                >
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedUser && (
            <Paper style={{ padding: 16 }}>
              <Typography variant='h6'>{selectedUser.name}</Typography>
              <Typography>Age: {selectedUser.age}</Typography>
              <Typography>Weight: {selectedUser.weight} kg</Typography>
              <Typography>Height: {selectedUser.height} cm</Typography>
              <Button
                variant='contained'
                color='primary'
                onClick={handleOpenDietChart}
                style={{ marginTop: 16 }}
              >
                Assign Diet Chart
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={openDietChart}
        onClose={handleCloseDietChart}
        maxWidth='lg'
        fullWidth
      >
        <DialogTitle>Assign Diet Chart for {selectedUser?.name}</DialogTitle>
        <DialogContent>
          <DietChart dietData={dietData} />
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

export default Dashboard
