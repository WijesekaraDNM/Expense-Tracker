import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Income from './common/Income';
import Expense from './common/Expenses';
import TransactionPage from './transactionPage';

const HomePage =() => {
    return(
        <div className=' w-full h-full bg-red'>
          <div className='w-full h-10 top-10 mt-10 bg-slate-400'>
            <a href='/login'>login</a>
          </div>
          <TransactionPage/>
          
        </div>
    );
};
 export default HomePage;