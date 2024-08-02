import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate('/counsellor/login')
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleLoginClick}>Counsellor Login</button>
    </div>
  )
}

export default Home
