import { toast } from "react-toastify";
import API from "../../api";

const getFundSources = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/settings/fund_sources?page=${page}`);
        return response.data.fund_sources
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 1000, // Closes after 3s
        });
        return null;
    }
}


const addFundSource =  async (formData) => {
    try {
        const response = await API.post("/dashboard/settings/fund_sources/add", formData, {
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
            if (error.response.data.errors.description) {
                toast.error(error.response.data.errors.description[0], {
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


const getAppointmentSetting =  async (id) => {
    try {
        const response = await API.get(`/dashboard/settings/appointments/view/${id}`, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return response.data.appointment_setting;
    } catch (error) {

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
    return null;
}


const updateAppointmentSetting =  async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/settings/appointments/edit", formData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            enqueueSnackbar(response.data?.success, {
                variant:"success"
            });
        }
        return true;
    } catch (error) {
        console.log(error);
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
            enqueueSnackbar(error.response.data.errors.id, {
                    variant:"error"
                });
            }
            if (error.response.data.errors.user_id) {
                enqueueSnackbar(error.response.data.errors.user_id[0], {
                    variant:"error"
                });
            }
            if (error.response.data.errors.day) {
                enqueueSnackbar(error.response.data.errors.day[0], {
                    variant:"error"
                });
            }
            if (error.response.data.errors.from_time) {
                enqueueSnackbar(error.response.data.errors.from_time[0], {
                    variant:"error"
                });
            }
            if (error.response.data.errors.to_time) {
                enqueueSnackbar(error.response.data.errors.to_time[0], {
                   variant:"error"
                });
            }
            if (error.response.data.errors.status) {
                enqueueSnackbar(error.response.data.errors.status[0], {
                    variant:"error"
                });
            }
            if (error.response.data.errors.overlap){
                error.response.data.errors.overlap.forEach(element => {
                    toast.error(element[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
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
const addFundSourcelot =  async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/settings/appointments/slots/add", formData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            enqueueSnackbar(response.data?.success, {
                variant:"success"
            });
        }
        return true;
    } catch (error) {
        console.log(error);
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
            enqueueSnackbar(error.response.data.errors.id, {
                    variant:"error"
                });
            }
            if (error.response.data.errors.appointment_setting) {
                enqueueSnackbar(error.response.data.errors.appointment_setting[0], {
                    variant:"error"
                });
            }
            if (error.response.data.errors.duration) {
                enqueueSnackbar(error.response.data.errors.duration[0], {
                    variant:"error"
                });
            }
            if (error.response.data.errors.from_time) {
                enqueueSnackbar(error.response.data.errors.from_time[0], {
                    variant:"error"
                });
            }
            if (error.response.data.errors.to_time) {
                enqueueSnackbar(error.response.data.errors.to_time[0], {
                   variant:"error"
                });
            }
            if (error.response.data.errors.overlap){
                error.response.data.errors.overlap.forEach(element => {
                    enqueueSnackbar(element[0], {variant:"error"
                });
                });
            }
        }

        if (error.response.data.error) {
            enqueueSnackbar(error.response.data.error, {variant:"error"
            });
        }
        if(error.message){
            
            enqueueSnackbar(error.message, {variant:"error"
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}

const deleteAppointmentSettingSlot =  async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/settings/appointments/slots/delete", formData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            enqueueSnackbar(response.data?.success, {
                variant:"success"
            });
        }
        return true;
    } catch (error) {
        console.log(error);
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
            enqueueSnackbar(error.response.data.errors.id, {
                    variant:"error"
                });
            }
        }

        if (error.response.data.error) {
            enqueueSnackbar(error.response.data.error, {variant:"error"
            });
        }
        if(error.message){
            
            enqueueSnackbar(error.message, {variant:"error"
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}

const FundSourceSettingsService = {
    getFundSources, addFundSource, getAppointmentSetting, updateAppointmentSetting, 
    addFundSourcelot, deleteAppointmentSettingSlot
}

export default FundSourceSettingsService