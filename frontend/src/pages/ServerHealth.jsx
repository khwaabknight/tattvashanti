import axios from 'axios';
import React, { useEffect } from 'react'
import api from '../utils/axiosConfig';
// import api from '@/utils/axiosConfig'

function ServerHealth() {
    const [health, setHealth] = React.useState(null);
    useEffect(() => {
        api.get(`/api/v1/healthcheck`).then((response) => {
            console.log(response)
            setHealth(response?.data)
        }).catch((error) => {
            console.log(error)
        });
    }, []);
    
  return (
    <div>
        {
            health ? (
                <div>
                    <h1>Server Health</h1>
                    <p>message: {health.message}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )
        }
    </div>

  )
}

export default ServerHealth