import { RootState } from '@/store/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


// when the account is signed in
const ProtectedRoute = ({children}:{children:React.ReactNode}) => {
    const user = useSelector((state:RootState) => state.user.user);
    if(user) return children
    else return <Navigate to={'/login'} />
}

export default ProtectedRoute