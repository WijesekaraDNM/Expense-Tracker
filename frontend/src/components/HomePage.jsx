import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Income from './common/Income';
import Expense from './common/Expenses';

const HomePage =() => {
    return(
        <div className=' w-full h-full bg-'>
          <div className='w-full h-10 top-10 mt-10 bg-slate-400'>
          </div>
          <Income/>
          <Expense/>
        </div>
    );
};
 export default HomePage;