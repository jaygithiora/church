import API from "../../api";

const getEvents = async (page = 1, enqueueSnackbar) => {
    try {
        //const response = await API.get(`/dashboard/settings/specialities?page=${page}`);
        const response = await API.get(`/dashboard/events?page=${page}`);
        return response.data.events

    } catch (error) {
        // console.log(error);
        enqueueSnackbar(error.message, {
            variant: "error"
        });
        return null;
    }
}


const addEvent = async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/stock_management/stock_take/add", formData, {
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
            if (error.response.data.errors.inventory_item) {
                enqueueSnackbar(error.response.data.errors.inventory_item[0], {variant:"error"});
            }
            if (error.response.data.errors.store) {
                enqueueSnackbar(error.response.data.errors.store[0], {variant:"error"});
            }
            if (error.response.data.errors.purchase_price) {
                enqueueSnackbar(error.response.data.errors.purchase_price[0], {variant:"error"});
            }
            if (error.response.data.errors.selling_price) {
                enqueueSnackbar(error.response.data.errors.selling_price[0], {variant:"error"});
            }
            if (error.response.data.errors.strength) {
                enqueueSnackbar(error.response.data.errors.strength[0], {variant:"error"});
            }
            if (error.response.data.errors.quantity) {
                enqueueSnackbar(error.response.data.errors.quantity[0], {variant:"error"});
            }
            if (error.response.data.errors.expiry_date) {
                enqueueSnackbar(error.response.data.errors.expiry_date[0], {variant:"error"});
            }
            if (error.response.data.errors.batch) {
                enqueueSnackbar(error.response.data.errors.batch[0], {variant:"error"});
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

const getEvent = async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/stock_management/stock_take/add", formData, {
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
            if (error.response.data.errors.inventory_item) {
                enqueueSnackbar(error.response.data.errors.inventory_item[0], {variant:"error"});
            }
            if (error.response.data.errors.store) {
                enqueueSnackbar(error.response.data.errors.store[0], {variant:"error"});
            }
            if (error.response.data.errors.purchase_price) {
                enqueueSnackbar(error.response.data.errors.purchase_price[0], {variant:"error"});
            }
            if (error.response.data.errors.selling_price) {
                enqueueSnackbar(error.response.data.errors.selling_price[0], {variant:"error"});
            }
            if (error.response.data.errors.strength) {
                enqueueSnackbar(error.response.data.errors.strength[0], {variant:"error"});
            }
            if (error.response.data.errors.quantity) {
                enqueueSnackbar(error.response.data.errors.quantity[0], {variant:"error"});
            }
            if (error.response.data.errors.expiry_date) {
                enqueueSnackbar(error.response.data.errors.expiry_date[0], {variant:"error"});
            }
            if (error.response.data.errors.batch) {
                enqueueSnackbar(error.response.data.errors.batch[0], {variant:"error"});
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

const EventsService = {
    getEvents, addEvent, getEvent
}

export default EventsService