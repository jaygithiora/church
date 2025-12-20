import { toast } from "react-toastify";
import API from "../../api";

const getProductStocks = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/products/stocks?page=${page}`);
        return response.data.product_stocks

    } catch (error) {
        // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}

const addProductStock = async (id, product, product_serial,status) => {
    try {
        const response = await API.post("/dashboard/products/stocks/add", {
            id, product, product_serial, status
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
            if (error.response.data.errors.product) {
                toast.error(error.response.data.errors.product[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.product_serial) {
                toast.error(error.response.data.errors.product_serial[0], {
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
const addProductStocks = async (id, product,items,status) => {
    try {
        const response = await API.post("/dashboard/products/stocks/bulk/add", {
            id, product, product, items, status
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
            if (error.response.data.errors.product) {
                toast.error(error.response.data.errors.product[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.items) {
                toast.error(error.response.data.errors.items[0], {
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


const ProductStocksService = {
    getProductStocks, addProductStock, addProductStocks
}

export default ProductStocksService;