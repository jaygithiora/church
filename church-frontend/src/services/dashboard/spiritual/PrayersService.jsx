import API from "../../api";

const getPrayers = async (page = 1, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/spiritual/prayers?page=${page}`);
        return response.data.prayers
        
    } catch (error) {
       // console.log(error);
        enqueueSnackbar(error.message, {variant:"error"});
        return null;
    }
}


const addPrayer =  async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/spiritual/prayers/add", formData, {
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
            if (error.response.data.errors.title) {
                enqueueSnackbar(error.response.data.errors.title[0],{variant:"error"});
            }
            if (error.response.data.errors.prayer) {
                enqueueSnackbar(error.response.data.errors.prayer[0],{variant:"error"});
            }
            if (error.response.data.errors.status) {
                enqueueSnackbar(error.response.data.errors.status[0],{variant:"error"});
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

const getPrayer = async (id) => {
    try {
        const response = await API.get(`/dashboard/spiritual/prayers/view/${id}`);
        return response.data.prayer;
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

const PrayersService = {
    getPrayers, addPrayer, getPrayer
}

export default PrayersService