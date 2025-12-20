import { toast } from "react-toastify";
import API from "../../api";

const getChildrenCheckIns = async (page = 1, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/children/checkins?page=${page}`);
        return response.data.child_checkins
        
    } catch (error) {
       // console.log(error);
        enqueueSnackbar(error.message, {variant:"error"});
        return null;
    }
}


const addChildCheckIn =  async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/children/checkins/add", formData, {
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
            if (error.response.data.errors.child) {
                enqueueSnackbar(error.response.data.errors.child[0],{variant:"error"});
            }
            if (error.response.data.errors.child_event) {
                enqueueSnackbar(error.response.data.errors.child_event[0],{variant:"error"});
            }
            if (error.response.data.errors.check_in_time) {
                enqueueSnackbar(error.response.data.errors.check_in_time[0],{variant:"error"});
            }
            if (error.response.data.errors.check_out_time) {
                enqueueSnackbar(error.response.data.errors.check_out_time[0],{variant:"error"});
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

const getChildCheckIn = async (id) => {
    try {
        const response = await API.get(`/dashboard/children/checkins/view/${id}`);
        return response.data.child_check_in;
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

const ChildrenCheckInService = {
    getChildrenCheckIns, addChildCheckIn, getChildCheckIn
}

export default ChildrenCheckInService