import { toast } from "react-toastify";
import API from "../../api";

const getChildrenEvents = async (page = 1, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/children/events?page=${page}`);
        return response.data.events
        
    } catch (error) {
       // console.log(error);
        enqueueSnackbar(error.message, {variant:"error"});
        return null;
    }
}


const addChildEvent =  async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/children/events/add", formData, {
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
            if (error.response.data.errors.name) {
                enqueueSnackbar(error.response.data.errors.name[0],{variant:"error"});
            }
            if (error.response.data.errors.description) {
                enqueueSnackbar(error.response.data.errors.description[0],{variant:"error"});
            }
            if (error.response.data.errors.event_date) {
                enqueueSnackbar(error.response.data.errors.event_date[0],{variant:"error"});
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

const getChildEvent = async (id) => {
    try {
        const response = await API.get(`/dashboard/children/events/view/${id}`);
        return response.data.event;
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

const ChildrenEventsService = {
    getChildrenEvents, addChildEvent, getChildEvent
}

export default ChildrenEventsService