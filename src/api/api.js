import axios from "axios";

export const api = axios.create({
    baseURL:
    "https://expense-sharing-backend-uu00.onrender.com/" ,
    headers:{
        "content-Type": "application/json",
    },
});

export default api;