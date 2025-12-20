import { toast } from "react-toastify";
import API from "../../api";

const getProductCategories = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/products/categories?page=${page}`);
        return response.data.categories

    } catch (error) {
        // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}

const addProductCategory = async (id, name, description, croppedImage,status) => {
    try {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("status", status);
        if(croppedImage){
        formData.append("image", croppedImage);
        }
        const response = await API.post("/dashboard/products/categories/add", formData, {
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
            if (error.response.data.errors.name) {
                toast.error(error.response.data.errors.name[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.description) {
                toast.error(error.response.data.errors.description[0], {
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


const ProductCategoriesService = {
    getProductCategories, addProductCategory
}

export default ProductCategoriesService;