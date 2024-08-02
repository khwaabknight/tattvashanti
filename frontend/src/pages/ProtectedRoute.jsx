import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null
  return isAuthenticated ? children : <Navigate to='/counsellor/login' />
}

export default ProtectedRoute
