import { toast } from "react-toastify";
import API from "../../api";

const getProductPromotions = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/products/promotions?page=${page}`);
        return response.data.promotions

    } catch (error) {
        // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        console.log("Failed! ", error?.response?.data || error.message);
        return null;
    }
}

const addProductPromotion = async (id, product, amount,from_date, to_date,status) => {
    try {
        const response = await API.post("/dashboard/products/promotions/add", {
            id,product,amount,from_date,to_date,status
        });
        if (response.data.success) {
            toast.success(response.data.success, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        return true;
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                toast.error(error.response.data.errors.id[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.product) {
                toast.error(error.response.data.errors.product[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.from_date) {
                toast.error(error.response.data.errors.from_date[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.to_date) {
                toast.error(error.response.data.errors.to_date[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.amount) {
                toast.error(error.response.data.errors.amount[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.status) {
                toast.error(error.response.data.errors.status[0], {
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


const ProductPromotionsService = {
    getProductPromotions, addProductPromotion
}

export default ProductPromotionsService;