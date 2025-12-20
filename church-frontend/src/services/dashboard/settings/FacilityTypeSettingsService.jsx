import API from "../../api";

const getFacilityTypes = async (page = 1, enqueueSnackbar, search="") => {
    try {
        //const response = await API.get(`/dashboard/settings/specialities?page=${page}`);
        const response = await API.get(`/dashboard/settings/facility_types?page=${page}&search=${search}`);
        return response.data.facility_types

    } catch (error) {
        // console.log(error);
        enqueueSnackbar(error.message, {
            variant: "error"
        });
        return null;
    }
}

const addFacilityType = async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/settings/facility_types/add", formData, {
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
            if (error.response.data.errors.description) {
                enqueueSnackbar(error.response.data.errors.description[0], {variant:"error"});
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

const deleteFacilityType = async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/settings/facility_types/delete", formData, {
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

const FacilityTypeSettingsService = {
    getFacilityTypes, addFacilityType, deleteFacilityType
}

export default FacilityTypeSettingsService