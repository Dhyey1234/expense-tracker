import axios from "axios";


export const authApi = axios.create({
    baseURL:"http://localhost/api/auth"
});


export const expenseApi = axios.create({
    baseURL:"http://localhost/api/expenses"
});