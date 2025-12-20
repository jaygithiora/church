import API from "../../api";

const getPractitioners = async (page = 1, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/practitioners?page=${page}`);
        return response.data.practitioners
        
    } catch (error) {
       // console.log(error);
        enqueueSnackbar(error.message, {variant:"error"});
        return null;
    }
}


const addPractitioner =  async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/practitioners/add", formData, {
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
            if (error.response.data.errors.practitioner_type) {
                enqueueSnackbar(error.response.data.errors.practitioner_type[0],{variant:"error"});
            }
            if (error.response.data.errors.speciality) {
                enqueueSnackbar(error.response.data.errors.speciality[0],{variant:"error"});
            }
            if (error.response.data.errors.user) {
                enqueueSnackbar(error.response.data.errors.user[0],{variant:"error"});
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

const PractitionersService = {
    getPractitioners, addPractitioner
}

export default PractitionersService