import { toast } from "react-toastify";
import API from "../../api";

const getUsers = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/users?page=${page}`);
        return response.data.users
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}


const addUser = async (id, firstname, lastname, email, phone, role, status, user_tag) => {
    try {
        const response = await API.post("/dashboard/users/add", { id, firstname, lastname,email, phone, role, status, user_tag });
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
            if (error.response.data.errors.firstname) {
                toast.error(error.response.data.errors.firstname[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.lastname) {
                toast.error(error.response.data.errors.lastname[0], {
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
            if (error.response.data.errors.user_tag) {
                toast.error(error.response.data.errors.user_tag[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.status) {
                toast.error(error.response.data.errors.status[0], {
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


const UsersService = {
    getUsers,addUser
}

export default UsersService