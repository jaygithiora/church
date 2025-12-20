import { toast } from "react-toastify";
import API from "../../api";

const getTransactions = async (page = 1, type='all') => {
    try {
        const response = await API.get(`/dashboard/transactions/${type}?page=${page}`);
        return response.data.my_transactions
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}
const getBalance = async ()=> {
    try {
        const response = await API.get('/dashboard/transactions/get/balance');
        return response.data.balance;
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}


const addUser = async (id, name, email, phone, role) => {
    try {
        const response = await API.post("/dashboard/users/add", { id, name, email, phone, role });
        if (response.data.success) {
            toast.success(response.data.success, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                toast.error(error.response.data.errors.id[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.name) {
                toast.error(error.response.data.errors.name[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.email) {
                toast.error(error.response.data.errors.email[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.phone) {
                toast.error(error.response.data.errors.phone[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.role) {
                toast.error(error.response.data.errors.role[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
        }

        if (error.response.data.error) {
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
}


const TransactionsService = {
    getTransactions,getBalance, addUser
}

export default TransactionsService