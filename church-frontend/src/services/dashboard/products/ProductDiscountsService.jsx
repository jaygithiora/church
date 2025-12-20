import { toast } from "react-toastify";
import API from "../../api";

const getProductDiscounts = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/products/discounts?page=${page}`);
        return response.data.product_discounts

    } catch (error) {
        // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}

const addProductDiscount = async (id, product, role,discount, discount_type,status, user_tag) => {
    try {
        const response = await API.post("/dashboard/products/discounts/add", {
            id,product,role,discount,discount_type,status,user_tag
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
            if (error.response.data.errors.role) {
                toast.error(error.response.data.errors.role[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.discount) {
                toast.error(error.response.data.errors.discount[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.tag) {
                toast.error(error.response.data.errors.discount_type[0], {
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
            if (error.response.data.errors.user_tag) {
                toast.error(error.response.data.errors.user_tag[0], {
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


const ProductDiscountsService = {
    getProductDiscounts, addProductDiscount
}

export default ProductDiscountsService;