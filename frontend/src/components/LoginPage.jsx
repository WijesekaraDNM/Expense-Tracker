import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage =() => {
    return(
        <div>
            <div><h>Login</h></div>
            <div><h>Username</h></div>
        </div>
    );
};
 export default LoginPage