import API from "../../api";

const getOrderOfServices = async (page = 1, enqueueSnackbar) => {
    try {
        //const response = await API.get(`/dashboard/settings/specialities?page=${page}`);
        const response = await API.get(`/dashboard/order-of-services?page=${page}`);
        return response.data.order_of_services

    } catch (error) {
        // console.log(error);
        enqueueSnackbar(error.message, {
            variant: "error"
        });
        return null;
    }
}


const addOrderOfService = async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/order-of-services/add", formData, {
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
            if (error.response.data.errors.end_tim) {
                enqueueSnackbar(error.response.data.errors.end_tim[0], {variant:"error"});
            }
            if (error.response.data.errors.banner) {
                enqueueSnackbar(error.response.data.errors.banner[0], {variant:"error"});
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

const getOrderOfService = async (id, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/order-of-services/view/${id}`,{
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            enqueueSnackbar(response.data?.success, {variant:"success"});
        }
        return response.data?.order_of_service;
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

const OrderOfServicesService = {
    getOrderOfServices, addOrderOfService, getOrderOfService
}

export default OrderOfServicesService