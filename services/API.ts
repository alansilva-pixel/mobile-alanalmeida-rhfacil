import axios from "axios";

const api = axios.create({
    baseURL: "https://q8fpzsvx5c.execute-api.us-east-1.amazonaws.com/prod", 
    timeout: 10000, 
    headers: {
        "Content-Type": "application/json",
    }
});

export default api;
