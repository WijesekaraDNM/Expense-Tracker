import axios from "axios";

axios.defaults.baseURL = 'http://localhost:5000';

export const registration = async (userData)=>{
    console.log("Sending register data:", userData);
    try {
        const { data } = await axios.post("api/users/register",userData);
        console.log("User is created", data);
        return data;
    } catch (error) {
        console.error("Error adding user:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const login = async (userData)=>{
    console.log("Sending login data:", userData);
    try {
        const { data } = await axios.post("api/users/login",userData);
        console.log("login is checked", data);
        return data;
    } catch (error) {
        console.error("Error check login:", error.response ? error.response.data : error.message);
        throw error;
    }
}