import { toast } from "react-toastify";
import API from "../../api";

const getGenders = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/settings/genders?page=${page}`);
        return response.data.genders
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 1000, // Closes after 3s
        });
        return null;
    }
}


const addGender =  async (formData) => {
    try {
        const response = await API.post("/dashboard/settings/genders/add", formData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            toast.success(response.data?.success, {
                position: "top-right",
                autoClose: 1000, // Closes after 3s
            });
        }
        return true;
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                toast.error(error.response.data.errors.id, {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.name) {
                toast.error(error.response.data.errors.name[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
        }

        if (error.response.data.error) {
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 1000, // Closes after 3s
            });
        }
        if(error.message){
            
            toast.error(error.message, {
                position: "top-right",
                autoClose: 1000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}

const GenderSettingsService = {
    getGenders, addGender
}

export default GenderSettingsService