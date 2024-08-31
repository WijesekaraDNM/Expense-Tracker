import axios from "axios";

axios.defaults.baseURL = 'http://localhost:5000';

export const registration = async (userData)=>{
    console.log("Sending register data:", userData);
    try {
        const { data } = await axios.post('api/users/register',userData);
        console.log("User is created", data);
        return data;
    } catch (error) {
        console.error("Error adding user:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const loginTo = async (userData)=>{
    console.log("Sending login data:", userData);
    try {
        const { data } = await axios.post('api/users/login',userData);
        console.log("login is checked", data);
        return data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error("Email or password incorrect");
        } else {
            console.error("Error checking login:", error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

export const sendPasswordResetEmail = async (email)=>{
    console.log("Sending password reset email to:", email);
    try {
        const { data } = await axios.post('api/users/forgot-password',{email});
        console.log("New password sended", data);
        return data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error("Email is incorrect");
        } else {
            console.error("Error in sending email:", error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

export const resetNewPassword = async (token, password)=>{

    try {
        const { data } = await axios.post('api/users/reset-password/'+ token, {password});
        console.log("Sent new password", data);
        return data;
    } catch (error) {
        console.error("Error in reseting password:", error.response ? error.response.data : error.message);
        throw error; 
    }
}
