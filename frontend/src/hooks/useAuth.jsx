import { useState, createContext, useContext, useEffect } from 'react';
import { loginTo } from '../Services/userService';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
     
    const login = async (data) => {
      try{
        const result = await loginTo(data);
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('userName', result.userName);
        
        setUserId(result.userId);
        setUserName(result.userName);
        setIsAuthenticated(true);
      }catch(error){
        console.error("Login failed:", error);
        throw error;
      }

    };

    const logout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('userId'); 
        localStorage.removeItem('userName'); 
        
        setUserId(null);
        setUserName(null);
        setIsAuthenticated(false);
      };

    return(
        <AuthContext.Provider value={{ isAuthenticated, login, logout, userId, userName}}>
            { children }
        </AuthContext.Provider>
    );    
};

export const useAuth = () => useContext(AuthContext);