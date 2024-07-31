import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import ServerHealth from './pages/ServerHealth'
import Home from './pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/serverhealth" element={<ServerHealth/>} />
      </Routes>
    </div>
  )
}

export default App
