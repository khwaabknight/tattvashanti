import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import ServerHealth from './pages/ServerHealth'
import Home from './pages/Home'
import CounsellorLogin from './pages/CounsellorLogin'
import CounsellorRegister from './pages/CounsellorRegister'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './pages/ProtectedRoute'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/counsellor/login' element={<CounsellorLogin />} />
        <Route path='/counsellor/register' element={<CounsellorRegister />} />
        <Route
          path='/counsellor/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path='/serverhealth' element={<ServerHealth />} />
      </Routes>
    </div>
  )
}

export default App
