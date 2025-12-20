import API from "../../api";

const getMedicineFrequencies = async (page = 1, enqueueSnackbar) => {
    try {
        //const response = await API.get(`/dashboard/settings/specialities?page=${page}`);
        const response = await API.get(`/dashboard/settings/medicine_frequencies?page=${page}`);
        return response.data.medicine_frequencies

    } catch (error) {
        // console.log(error);
        enqueueSnackbar(error.message, {
            variant: "error"
        });
        return null;
    }
}


const addMedicineFrequency = async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/settings/medicine_frequencies/add", formData, {
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
                enqueueSnackbar(error.response.data.errors.id[0], {variant:"error"});
            }
            if (error.response.data.errors.name) {
                enqueueSnackbar(error.response.data.errors.name[0], {variant:"error"});
            }
            if (error.response.data.errors.frequency) {
                enqueueSnackbar(error.response.data.errors.frequency[0], {variant:"error"});
            }
            if (error.response.data.errors.description) {
                enqueueSnackbar(error.response.data.errors.description[0], {variant:"error"});
            }
            if (error.response.data.errors.status) {
                enqueueSnackbar(error.response.data.errors.status[0], {variant:"error"});
            }
        }

        if (error.response.data.error) {
            enqueueSnackbar(error.response.data.error, {variant:"error"});
        }
        if (error.message) {

            enqueueSnackbar(error.message, {variant:"error"});
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}

const MedicineFrequenciesService = {
    getMedicineFrequencies, addMedicineFrequency
}

export default MedicineFrequenciesService