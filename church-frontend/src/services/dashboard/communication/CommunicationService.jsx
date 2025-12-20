import { toast } from "react-toastify";
import API from "../../api";

const getEmails = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/emails?page=${page}`);
        return response.data.emails
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 1000, // Closes after 3s
        });
        return null;
    }
}

const sendEmail =  async (formData) => {
    try {
        const response = await API.post("/dashboard/emails/add", formData, {
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
        console.log("error", error);
        if (error.response.data.errors) {
            console.log("errors 111111", error.response.data.errors);
            if (error.response.data.errors.id) {
                toast.error(error.response.data.errors.id[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.content) {
                toast.error(error.response.data.errors.content[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.subject) {
                toast.error(error.response.data.errors.subject[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.recipients) {
                toast.error(error.response.data.errors.recipients[0], {
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

const getEmail = async (id) => {
    try {
        const response = await API.get(`/dashboard/emails/view/${id}`);
        return response.data.email
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 1000, // Closes after 3s
        });
        return null;
    }
}

const getSmses = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/smses?page=${page}`);
        return response.data.smses;
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 1000, // Closes after 3s
        });
        return null;
    }
}

const sendSms =  async (formData) => {
    try {
        const response = await API.post("/dashboard/smses/add", formData, {
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
        console.log("error", error);
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                toast.error(error.response.data.errors.id[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.message) {
                toast.error(error.response.data.errors.message[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.recipients) {
                toast.error(error.response.data.errors.recipients[0], {
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

const getSms = async (id) => {
    try {
        const response = await API.get(`/dashboard/smses/view/${id}`);
        return response.data.sms;
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 1000, // Closes after 3s
        });
        return null;
    }
}

const getSchedules = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/schedules?page=${page}`);
        return response.data.schedules;ß
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 1000, // Closes after 3s
        });
        return null;
    }
}

const addSchedule =  async (formData) => {
    try {
        const response = await API.post("/dashboard/schedules/add", formData, {
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
        console.log("error", error);
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                toast.error(error.response.data.errors.id[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.message) {
                toast.error(error.response.data.errors.message[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.recipients) {
                toast.error(error.response.data.errors.recipients[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.schedule) {
                toast.error(error.response.data.errors.schedule[0], {
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

const getSchedule = async (id) => {
    try {
        const response = await API.get(`/dashboard/schedules/view/${id}`);
        return response.data.schedule;
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 1000, // Closes after 3s
        });
        return null;
    }
}

const CommunicationService = {
    getEmails, sendEmail, getEmail, getSmses, sendSms, getSms, getSchedules, addSchedule, getSchedule
}

export default CommunicationService;