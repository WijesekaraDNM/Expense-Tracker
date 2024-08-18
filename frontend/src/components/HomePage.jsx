import React from 'react';
import { useAuth } from '../hooks/useAuth';
import TransactionPage from './transactionPage';

const HomePage =() => {
 
  const { logout } = useAuth();

  const handleLogout = async(e) => {
    e.preventDefault();
    await logout();
  }

  return(
      <div className=' w-full h-full bg-red'>
        <div className='w-full h-10 top-10 mt-10 bg-slate-400'>
          <button onClick={ handleLogout}>logout</button>
        </div>
        <TransactionPage/>   
      </div>
  );
};
 export default HomePage;