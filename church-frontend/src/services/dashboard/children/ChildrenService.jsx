import { toast } from "react-toastify";
import API from "../../api";

const getChildren = async (page = 1, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/children?page=${page}`);
        return response.data.children
        
    } catch (error) {
       // console.log(error);
        enqueueSnackbar(error.message, {variant:"error"});
        return null;
    }
}


const addChild =  async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/children/add", formData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            enqueueSnackbar(response.data?.success, {variant:"success"});
        }
        return true;
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                enqueueSnackbar(error.response.data.errors.id[0],{variant:"error"});
            }
            if (error.response.data.errors.firstname) {
                enqueueSnackbar(error.response.data.errors.firstname[0],{variant:"error"});
            }
            if (error.response.data.errors.lastname) {
                enqueueSnackbar(error.response.data.errors.lastname[0],{variant:"error"});
            }
            if (error.response.data.errors.date_of_birth) {
                enqueueSnackbar(error.response.data.errors.date_of_birth[0],{variant:"error"});
            }
            if (error.response.data.errors.gender) {
                enqueueSnackbar(error.response.data.errors.gender[0],{variant:"error"});
            }
            if (error.response.data.errors.user) {
                enqueueSnackbar(error.response.data.errors.user[0],{variant:"error"});
            }
            if (error.response.data.errors.status) {
                enqueueSnackbar(error.response.data.errors.status[0],{variant:"error"});
            }
            if (error.response.data.errors.location) {
                enqueueSnackbar(error.response.data.errors.location[0],{variant:"error"});
            }
            if (error.response.data.errors.longitude) {
                enqueueSnackbar(error.response.data.errors.longitude[0],{variant:"error"});
            }
            if (error.response.data.errors.latitude) {
                enqueueSnackbar(error.response.data.errors.latitude[0],{variant:"error"});
            }
        }

        if (error.response.data.error) {
            enqueueSnackbar(error.response.data.error, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        if(error.message){
            
            enqueueSnackbar(error.message, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}

const getChild = async (id) => {
    try {
        const response = await API.get(`/dashboard/children/view/${id}`);
        return response.data.child;
    } catch (error) {
        if (error.response.data.error) {
            enqueueSnackbar(error.response.data.error, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        if(error.message){
            
            enqueueSnackbar(error.message, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return null;
}

const ChildrenService = {
    getChildren, addChild, getChild
}

export default ChildrenService