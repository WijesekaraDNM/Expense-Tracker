import axios from "axios";
axios.defaults.baseURL = 'http://localhost:5000';

export const getTransactions = async (userId, dates) => {
    const {data} = await axios.post('/api/transactions/getAll/'+ userId, dates);
    console.log("Added transactions in the database", data);
    return data;
}
export const addTransaction = async (newData) => {
    // const {data} = await axios.post('/api/transactions/addTransaction', newData);
    // console.log("Transaction is created", data);
    // return data;
    console.log("Sending data:", newData);
    try {
        const { data } = await axios.post('/api/transactions/addTransaction/', newData);
        console.log("Transaction is created", data);
        return data;
    } catch (error) {
        console.error("Error adding transaction:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const updateTransaction = async (transactionID, newData)=> {
    // const {data} = await axios.patch('/api/transactions/updateTransaction/'+ transactionID, newData);
    // console.log("Updated transaction", data);
    // return data;
    console.log("sended to database for updating:", newData);
    try {
        const {data} = await axios.patch('/api/transactions/updateTransaction/'+ transactionID, newData);
        console.log("Updated transaction", data);
        return data;
    } catch (error) {
        console.error("Error updating transaction:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const deleteTransaction = async (transactionID) => {
    // const {data} = await axios.delete('/api/transactions/deleteTransaction/' + transactionID);
    // console.log("Deleted transaction", data);
    // return data;
    try {
        const {data} = await axios.delete('/api/transactions/deleteTransaction/' + transactionID);
        console.log("Deleted transaction", data);
        return data;
    } catch (error) {
        console.error("Error deleting transaction:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const getCategories = async (userId) => {
    try {
        console.log("UserId categories", userId);
        const {data} = await axios.get('/api/transactions/categories/'+ userId);
        console.log("Get categories", data);
        return data;
    } catch (error) {
        console.error("Error getting categories:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const calculateTransactions = async (userId,dates) => {
    try {
        const {data} = await axios.post('/api/calculations/totals/' + userId, dates);
        console.log("Calculations", data);
        console.log("Dates in services", dates);
        return data;
    } catch (error) {
        console.error("Error rendering calculations:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const calculateCategoricalAmounts = async (userId, dates) => {
    try {
        const {data} = await axios.post('/api/calculations/categorical-amounts/' + userId, dates);
        console.log("Categorical Amounts:", data);
        return data;
    } catch (error) {
        console.error("Error rendering calculations:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const dailyForcastOfIncomeExpense = async (userId) => {
    try {
        const {data} = await axios.get('/api/calculations/totals/daily/' + userId);
        console.log("Daily Income Expense Amounts:", data);
        return data;
    } catch (error) {
        console.error("Error rendering calculations:", error.response ? error.response.data : error.message);
        throw error;
    }
}

