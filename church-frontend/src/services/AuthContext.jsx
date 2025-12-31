import axios from "axios";
import { createContext, useState, useContext } from "react";
import { toast } from "react-toastify";
import API from "./api";
import CartService from "./dashboard/CartService";
//import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [isVerified, setIsVerified] = useState(() => {
        const saveUser = localStorage.getItem("user");
        const myUser = saveUser ? JSON.parse(saveUser) : null;
        if (myUser != null) {
            if (myUser.phone_verified_at) {
                return true;
            }
        }
        return false;
    });
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(() => {
        //localStorage.removeItem("user");
        //localStorage.removeItem("permissions");
        //localStorage.removeItem("token");
        const saveUser = localStorage.getItem("user");
        return saveUser ? JSON.parse(saveUser) : null
    });
    const [permissions, setPermissions] = useState(() => {
        const savedPermissions = localStorage.getItem("permissions");
        return savedPermissions ? JSON.parse(savedPermissions) : null;
    });
    // Initialize cart state from CartService (or localStorage)
    const [cart, setCart] = useState(() => CartService.getCart() || []);

    // A helper to update cart state from the service
    const updateCart = () => {
        setCart([...CartService.getCart()]);
    };

    const login = async (email, password) => {
        try {
            const response = await API.post('/login', { email, password });
            if (response.data.access_token) {
                localStorage.setItem("token", response.data.access_token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("permissions", JSON.stringify(response.data.permissions));
                setIsAuthenticated(true);
                setIsVerified(response.data.user.phone_verified_at != null);
                setUser(response.data.user);
                setPermissions(response.data.permissions);

                setIsAuthenticated(true);
                toast.success("Success! Login Successful.", {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                if (error.response.data.errors.email) {
                    toast.error(error.response.data.errors.email[0], {
                        position: "top-right",
                        autoClose: 3000, // Closes after 3s
                    });
                }
                if (error.response.data?.errors?.password) {
                    toast.error(error.response.data.errors.password[0], {
                        position: "top-right",
                        autoClose: 3000, // Closes after 3s
                    });
                }
            }

            if (error.response?.data?.error) {
                toast.error(error.response.data.error, {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.message) {
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            console.log("Login Failed! ", error?.response?.data || error.message);
        }
    }

    const register = async (formData, enqueueSnackbar) => {
        console.log("form data", formData);
        try {
            const response = await API.post('/register', formData,
                { headers: { "Content-Type": "multipart/form-data" } });
            if (response.data.access_token) {
                localStorage.setItem("token", response.data.access_token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("permissions", JSON.stringify(response.data.permissions));
                setIsAuthenticated(true);
                setUser(response.data.user);
                setPermissions(response.data.permissions);
                setIsAuthenticated(true);
            }
        } catch (error) {
            if (error?.response?.data?.errors) {
                if (error.response.data.errors.firstname) {
                    enqueueSnackbar(error.response.data.errors.firstname[0], {
                        variant: "error",
                    });
                }
                if (error.response?.data.errors.lastname) {
                    enqueueSnackbar(error.response.data.errors.lastname[0], {
                        variant:"error"
                    });
                }
                if (error.response.data.errors.phone) {
                    enqueueSnackbar(error.response.data.errors.phone[0], {
                       variant:"error"
                    });
                }
                if (error.response.data.errors.email) {
                    enqueueSnackbar(error.response.data.errors.email[0], {
                        variant:"error"
                    });
                }
                if (error.response.data.errors.password) {
                    enqueueSnackbar(error.response.data.errors.password[0], {
                        variant:"error"
                    });
                }
                if (error.response.data.errors.role) {
                    enqueueSnackbar(error.response.data.errors.role[0], {
                       variant:"error"
                    });
                }
                if (error.response.data.errors.business_name) {
                    enqueueSnackbar(error.response.data.errors.business_name[0], {
                       variant:"error"
                    });
                }
                if (error.response.data.errors.location) {
                    enqueueSnackbar(error.response.data.errors.location[0], {
                       variant:"error"
                    });
                }
                if (error.response.data.errors.latitude) {
                    enqueueSnackbar(error.response.data.errors.latitude[0], {
                       variant:"error"
                    });
                }
                if (error.response.data.errors.terms_and_conditions) {
                    enqueueSnackbar(error.response.data.errors.terms_and_conditions[0], {
                       variant:"error"
                    });
                }
            }
            console.log("Register Failed! ", error?.response?.data || error.message);
        }
    }

    const checkOtp = async () => {
        try {
            const response = await API.post('/check_phone_verification_code');
            return true;
        } catch (error) {
            if (error.message) {
                if (error.message) {
                    toast.error(error.message, {
                        position: "top-right",
                        autoClose: 3000, // Closes after 3s
                    });
                }
            }
            console.log("Check OTP Failed! ", error?.response?.data || error.message);
        }
        return false;
    }
    const sendOtp = async () => {
        try {
            const response = await API.post('/phone_verification_code');
            if (response?.data?.success) {
                toast.success(response.data.success, {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            return true;
        } catch (error) {
            if (error.message) {
                if (error.message) {
                    toast.error(error.message, {
                        position: "top-right",
                        autoClose: 3000, // Closes after 3s
                    });
                }
            }
            console.log("Send OTP Failed! ", error?.response?.data || error.message);
        }
        return false;
    }

    const verifyOtp = async (verification_code) => {
        try {
            const response = await API.post('/validate_phone', { verification_code });

            if (response?.data?.success) {
                toast.success(response.data.success, {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if(response?.data?.user){
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }
            return true;
        } catch (error) {
            if (error.response.data.error) {
                toast.error(error.response.data.error, {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });

            }
            if (error.message) {
                if (error.message) {
                    toast.error(error.message, {
                        position: "top-right",
                        autoClose: 3000, // Closes after 3s
                    });
                }
            }
            console.log("Send OTP Failed! ", error?.response?.data || error.message);
        }
        return false;
    }

    const updateUser = (updatedUser) => {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser((prevUser) => ({
            ...prevUser,
            ...updatedUser,
        }));
    }
    const logout = async () => {
        try {
            const response = await API.post("/dashboard/logout");
            if (response.data.message) {
                toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            return true;
        } catch (error) {
            console.log('error', error);
            console.log('message', error.message);
            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
            return false;
        }
    }



    return (<AuthContext.Provider value={{
        loading, setLoading, isAuthenticated, setIsAuthenticated,
        isVerified, setIsVerified, user, permissions, register, login, logout, updateUser, cart,
        updateCart, checkOtp, sendOtp, verifyOtp
    }}>
        {children}
    </AuthContext.Provider>);
};

export const useAuth = () => useContext(AuthContext);