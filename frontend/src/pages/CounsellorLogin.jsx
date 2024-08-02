import React, { useState } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  Link,
} from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import api from '../utils/axiosConfig' // Import your custom Axios instance

const CounsellorLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await api.post('/api/v1/counsellor/login', {
        email,
        password,
      })
      setOpenSnackbar(true)
      // Store the access token if needed (e.g., for making authenticated requests)
      localStorage.setItem('accessToken', response.data.data.accessToken)
      // Redirect to dashboard after successful login
      setTimeout(() => navigate('/counsellor/dashboard'), 1500)
    } catch (error) {
      console.error('Error during login:', error)
      setError(
        error.response?.data?.message || 'An error occurred during login'
      )
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4 }}>
        <Typography component='h1' variant='h5' align='center'>
          Counsellor Login
        </Typography>
        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color='error' variant='body2' sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Typography variant='body2' align='center' sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to='/counsellor/register'>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity='success'
          sx={{ width: '100%' }}
        >
          Login successful! Redirecting to dashboard...
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default CounsellorLogin
