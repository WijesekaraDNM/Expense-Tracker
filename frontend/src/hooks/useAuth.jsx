import { useState, createContext, useContext } from 'react';
import { loginTo } from '../Services/userService';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
     
    const login = async (data) => {
      try{
        const result = await loginTo(data);
        localStorage.setItem('token', result.token); 
        setUserId(result.userId);
        setIsAuthenticated(true);
      }catch(error){
        console.error("Login failed:", error);
        throw error;
      }

    };

    const logout = () => {
        localStorage.removeItem('token'); 
        setUserId(null);
        setIsAuthenticated(false);
      };

    return(
        <AuthContext.Provider value={{ isAuthenticated, login, logout, userId}}>
            { children }
        </AuthContext.Provider>
    );    
};

export const useAuth = () => useContext(AuthContext);