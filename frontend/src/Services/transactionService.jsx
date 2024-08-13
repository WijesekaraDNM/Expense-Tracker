import axios from "axios";

axios.defaults.baseURL = 'http://localhost:5000';

export const getTransactions = async () => {
    const {data} = await axios.post('api/transactions/getAll');
    console.log("Added transactions in the database", data);
    return data;
}
export const addTransaction = async (newData) => {
    const {data} = await axios.post('api/transactions/addTransaction/', newData);
    console.log("Transaction is created", data);
    return data;
}

export const updateTransaction = async (transactionID, newData)=> {
    const {data} = await axios.patch('/api/transactions/updateTransaction/'+ transactionID, newData);
    console.log("Update transaction", data);
    return data;
}

export const deleteContact = async (transactionID) => {
    const {data} = await axios.delete('/api/transactions/deleteTransaction/' + transactionID);
    return data;
}

export const getCategories = async () => {
    const {data} = await axios.get('/api/transactions/categories');
    return data;
}

