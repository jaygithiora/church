import { toast } from "react-toastify";
import API from "../../api";

const getProducts = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/products?page=${page}`);
        return {'products':response.data.products, 'discounts':response.data.discounts};

    } catch (error) {
        // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}

const addProduct = async (id, item_name, item_code,category, unit, tag,tag_remarks, croppedImage, cost, selling, quantity, tax) => {
    try {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("item_name", item_name);
        formData.append("item_code", item_code);
        formData.append("unit", unit);
        formData.append("tag", tag);
        formData.append("tag_remarks", tag_remarks);
        formData.append("category", category);
        formData.append("cost", cost);
        formData.append("selling", selling);
        formData.append("quantity", quantity);
        if(croppedImage){
        formData.append("image", croppedImage);
        }
        if(tax != null){
            formData.append("tax", tax);
        }
        const response = await API.post("/dashboard/products/add", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Important for file uploads
            },
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
            if (error.response.data.errors.item_name) {
                toast.error(error.response.data.errors.item_name[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.item_code) {
                toast.error(error.response.data.errors.item_code[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.unit) {
                toast.error(error.response.data.errors.unit[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.tag) {
                toast.error(error.response.data.errors.tag[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.tag_remarks) {
                toast.error(error.response.data.errors.tag_remarks[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.image) {
                toast.error(error.response.data.errors.image[0], {
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
            if (error.response.data.errors.cost) {
                toast.error(error.response.data.errors.cost[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.selling) {
                toast.error(error.response.data.errors.selling[0], {
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

const getProduct = async (id) => {
    try {
        const response = await API.get(`/dashboard/products/view/${id}`);
        if (response.data.success) {
            toast.success(response.data.success, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        return response.data.product;
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


const ProductsService = {
    getProducts, addProduct, getProduct
}

export default ProductsService;