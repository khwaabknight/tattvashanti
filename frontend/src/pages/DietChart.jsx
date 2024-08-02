import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material'

const DietChart = ({ dietData }) => {
  // Assuming dietData is a 4x7 matrix
  const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

  return (
    <TableContainer component={Paper}>
      <Typography variant='h4' align='center' gutterBottom>
        Weekly Diet Chart
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Meal</TableCell>
            {days.map((day) => (
              <TableCell key={day} align='center'>
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {meals.map((meal, index) => (
            <TableRow key={meal}>
              <TableCell component='th' scope='row'>
                {meal}
              </TableCell>
              {dietData[index].map((food, dayIndex) => (
                <TableCell key={`${meal}-${days[dayIndex]}`} align='center'>
                  {food}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DietChart
