import { useState, createContext, useContext } from 'react';
import { loginTo } from '../Services/userService';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
     
    const login = async (data) => {
      try{
        const result = await loginTo(data);
        localStorage.setItem('token', result.token); 
        setIsAuthenticated(true);
      }catch(error){
        console.error("Login failed:", error);
        throw error;
      }

    };

    const logout = () => {
        localStorage.removeItem('token'); 
        setIsAuthenticated(false);
      };

    return(
        <AuthContext.Provider value={{ isAuthenticated, login, logout}}>
            { children }
        </AuthContext.Provider>
    );    
};

export const useAuth = () => useContext(AuthContext);