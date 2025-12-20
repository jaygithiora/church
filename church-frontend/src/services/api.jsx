import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_MEDIMEET_BACKEND_URL ?? ""}/api`,
    //baseURL: "https://api.medimeet.co.ke/api"
});

//Add authorization header automatically!
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle Expired Token or Unauthorized Response Globally
API.interceptors.response.use((response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            //Check if the response contains "Unauthenticated." message
            if (error.response.data.message && error.response.data.message.toLowerCase().includes("unauthenticated")) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("permissions");
                
                window.location.href = "/login";
            }
        }
        return Promise.reject(error); //return the error for further handling
    });

export default API;