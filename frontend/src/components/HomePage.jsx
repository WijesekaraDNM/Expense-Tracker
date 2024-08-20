import React from 'react';
import { useAuth } from '../hooks/useAuth';
import TransactionPage from './transactionPage';
import Dashboard from './dashboard';

const HomePage =() => {
 
  const { logout } = useAuth();

  const handleLogout = async(e) => {
    e.preventDefault();
    await logout();
  }

  return(
      <div className='flex flex-col w-full h-full bg-gradient-to-b from-expenseBC to-gray-100'>
        <div className='w-[70%] self-end relative rounded-l-full end-0 px-5 py-6 flex items-center justify-between mt-5 mb-5 bg-gradient-to-t from-expenseBC to-incomeBC'>
          <div className='flex '>
            <img src='/logo.png' alt='' className=' h-16 left-0'/>
          </div>
         
          <button onClick={ handleLogout} className='flex justify-center rounded items-center w-40 h-8 text-white focus:outline p-3 focus:test-gray-500 bg-transparent focus:bg-gray-transparent shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out '>logout</button>
        </div>
        <Dashboard/>
        <TransactionPage/>   
      </div>
  );
};
 export default HomePage;