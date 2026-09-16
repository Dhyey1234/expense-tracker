import axios from "axios";
export const authApi = axios.create({
    baseURL:"/api/auth"
});
export const expenseApi = axios.create({
    baseURL:"/api/expenses"
});
export const reportApi = axios.create({
    baseURL:"/api/reports"
});