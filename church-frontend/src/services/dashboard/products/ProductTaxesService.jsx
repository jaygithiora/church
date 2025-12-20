import { toast } from "react-toastify";
import API from "../../api";

const getProductTaxes = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/products/taxes?page=${page}`);
        return response.data.taxes

    } catch (error) {
        // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}

const addProductTax = async (id, name, value, tax_type, selling_price_inclusive, status) => {
    try {
        const response = await API.post("/dashboard/products/taxes/add", {
            id, name, value, tax_type, selling_price_inclusive, status
        }
        );
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
            if (error.response.data.errors.selling_price_inclusive) {
                toast.error(error.response.data.errors.selling_price_inclusive[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.tax_type) {
                toast.error(error.response.data.errors.tax_type[0], {
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
        if (error.message) {

            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}


const ProductTaxesService = {
    getProductTaxes, addProductTax
}

export default ProductTaxesService;