import API from "../../api";

const getDiaries = async (fromDate = "", toDate="", enqueueSnackbar) => {
    try {
        //const response = await API.get(`/dashboard/settings/specialities?page=${page}`);
        const response = await API.get(`/dashboard/diaries?from_date=${fromDate}&to_date=${toDate}`);
        return response.data.diaries

    } catch (error) {
        // console.log(error);
        enqueueSnackbar(error.message, {
            variant: "error"
        });
        return null;
    }
}


const addDiary = async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/diaries/add", formData, {
            /*headers: {
                "Content-Type": "application/json"
            },*/
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
            if (error.response.data.errors.start_time) {
                enqueueSnackbar(error.response.data.errors.start_time[0], {variant:"error"});
            }
            if (error.response.data.errors.end_time) {
                enqueueSnackbar(error.response.data.errors.end_time[0], {variant:"error"});
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

const getDiary = async (id, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/diaries/view/${id}`,{
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            enqueueSnackbar(response.data?.success, {variant:"success"});
        }
        return response.data?.diary;
    } catch (error) {

        if (error.response.data.error) {
            enqueueSnackbar(error.response.data.error, {variant:"error"});
        }
        if (error.message) {

            enqueueSnackbar(error.message, {variant:"error"});
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return null;
}

const DiariesService = {
    getDiaries, addDiary, getDiary
}

export default DiariesService