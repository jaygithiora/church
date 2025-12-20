import { toast } from "react-toastify";
import API from "../../api";

const getOrders = async (page = 1, type='all') => {
    try {
        const response = await API.get(`/dashboard/orders?page=${page}`);
        return response.data.orders
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}

const addOrder = async (id, cart, totals,phone) => {
    try {
        const response = await API.post("/dashboard/orders/add", {id,cart, totals,phone}, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.payment_response?.ResponseCode ==="0") {
            toast.success(response.data?.CustomerMessage, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }else{
            toast.success(response.data?.payment_response?.errorMessage, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        return response.data.order_id;
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                toast.error(error.response.data.errors.id[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.cart) {
                toast.error(error.response.data.errors.cart[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.totals) {
                toast.error(error.response.data.errors.totals[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.phone) {
                toast.error(error.response.data.errors.phone[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
        }

        if (error.response.data.error) {
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        if(error.message){
            
            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return 0;
}


const getOrder = async (id) => {
    try {
        const response = await API.get(`/dashboard/orders/view/${id}`);
        return response.data.order;
    } catch (error) {
        if (error.response.data.error) {
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        if(error.message){
            
            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return null;
}
const checkoutOrder = async (order_id, phone) => {
    try {
        const response = await API.post("/dashboard/orders/checkout", {order_id,phone}, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.payment_response?.CustomerMessage) {
            toast.success(response.data?.payment_response?.CustomerMessage, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }else if (response.data?.payment_response?.errorMessage) {
            toast.success(response.data?.payment_response?.errorMessage, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        return true;
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.order_id) {
                toast.error(error.response.data.errors.order_id[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.phone) {
                toast.error(error.response.data.errors.phone[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
        }

        if (error.response.data.error) {
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        if(error.message){
            
            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}


const OrdersService = {
    getOrders, addOrder, getOrder, checkoutOrder
}

export default OrdersService