import API from "../../api";

const getNotices = async (page = 1, enqueueSnackbar) => {
    try {
        //const response = await API.get(`/dashboard/settings/specialities?page=${page}`);
        const response = await API.get(`/dashboard/notices?page=${page}`);
        return response.data.notices

    } catch (error) {
        // console.log(error);
        enqueueSnackbar(error.message, {
            variant: "error"
        });
        return null;
    }
}


const addNotice = async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/notices/add", formData, {
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
            if (error.response.data.errors.notice_date) {
                enqueueSnackbar(error.response.data.errors.notice_date[0], {variant:"error"});
            }
            if (error.response.data.errors.role) {
                enqueueSnackbar(error.response.data.errors.role[0], {variant:"error"});
            }
            if (error.response.data.errors.banner) {
                enqueueSnackbar(error.response.data.errors.banner[0], {variant:"error"});
            }
            if (error.response.data.errors.age_group) {
                enqueueSnackbar(error.response.data.errors.age_group[0], {variant:"error"});
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

const getNotice = async (id, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/notices/view/${id}`,{
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            enqueueSnackbar(response.data?.success, {variant:"success"});
        }
        return response.data?.notice;
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


const getEventsAttendances = async (page = 1, enqueueSnackbar) => {
    try {
        //const response = await API.get(`/dashboard/settings/specialities?page=${page}`);
        const response = await API.get(`/dashboard/events/attendances?page=${page}`);
        return response.data.attendances

    } catch (error) {
        // console.log(error);
        enqueueSnackbar(error.message, {
            variant: "error"
        });
        return null;
    }
}


const addEventAttendance = async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/events/attendances/add", formData, {
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
            if (error.response.data.errors.user) {
                enqueueSnackbar(error.response.data.errors.user[0], {variant:"error"});
            }
            if (error.response.data.errors.check_in_time) {
                enqueueSnackbar(error.response.data.errors.check_in_time[0], {variant:"error"});
            }
            if (error.response.data.errors.check_out_time) {
                enqueueSnackbar(error.response.data.errors.check_out_time[0], {variant:"error"});
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


const NoticesService = {
    getNotices, addNotice, getNotice, getEventsAttendances,addEventAttendance
}

export default NoticesService