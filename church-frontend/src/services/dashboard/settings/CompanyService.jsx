import { toast } from "react-toastify";
import API from "../../api";

const getCompanies = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/settings/companies?page=${page}`);
        return response.data.companies

    } catch (error) {
        // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 1000, // Closes after 3s
        });
        return null;
    }
}


const addCompany = async (id, name, description, location, longitude, latitude,status) => {
    try {
        const response = await API.post("/dashboard/settings/companies/add", { id, name, description, location,longitude,latitude,status }, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            toast.success(response.data?.success, {
                position: "top-right",
                autoClose: 1000, // Closes after 3s
            });
        }
        return true;
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                toast.error(error.response.data.errors.id, {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.name) {
                toast.error(error.response.data.errors.name[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.description) {
                toast.error(error.response.data.errors.description[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.lontitude) {
                toast.error(error.response.data.errors.lontitude[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.latitude) {
                toast.error(error.response.data.errors.latitude[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.location) {
                toast.error(error.response.data.errors.location[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
            if (error.response.data.errors.status) {
                toast.error(error.response.data.errors.status[0], {
                    position: "top-right",
                    autoClose: 1000, // Closes after 3s
                });
            }
        }

        if (error.response.data.error) {
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 1000, // Closes after 3s
            });
        }
        if (error.message) {

            toast.error(error.message, {
                position: "top-right",
                autoClose: 1000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}

const CompanyService = {
    getCompanies, addCompany
}

export default CompanyService