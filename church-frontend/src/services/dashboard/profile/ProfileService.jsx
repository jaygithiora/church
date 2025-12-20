import { toast } from "react-toastify";
import API from "../../api";

const editProfile = async (formData) => {
    try {
        const response = await API.post("/dashboard/profile/edit", formData);
        if (response.data.success) {
            toast.success(response.data.success, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        return response.data.user;
    } catch (error) {
        if (error.response?.data?.errors) {
            if (error.response.data.errors.firstname) {
                toast.error(error.response.data.errors.firstname[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.lastname) {
                toast.error(error.response.data.errors.lastname[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
        }

        if (error.response?.data?.error) {
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        if (error?.message) {

            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return null;
}
const updatePassword = async (formData) => {
    try {
        const response = await API.post("/dashboard/profile/password/update", formData);
        if (response.data.success) {
            toast.success(response.data.success, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        return true;
    } catch (error) {
        if (error.response?.data?.errors) {
            if (error.response.data.errors.current_password) {
                toast.error(error.response.data.errors.current_password[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.new_password) {
                toast.error(error.response.data.errors.new_password[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
        }

        if (error.response?.data?.error) {
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        if (error?.message) {

            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}
const uploadProfile = async (croppedImage) => {
    try {
        const formData = new FormData();
        formData.append("image", croppedImage);
        
        const response = await API.post("/dashboard/profile/upload", formData, {
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
        return response.data.user;
    } catch (error) {
        if (error.response.data.errors) {
            
            if (error.response.data.errors.image) {
                toast.error(error.response.data.errors.image[0], {
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
    return null;
}

const getProfile = async() => {
    try {
        const response = await API.get(`/dashboard/profile`);
        console.log("profile response: ", response);
        return response.data.user
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 1000, // Closes after 3s
        });
        return null;
    }
}

const ProfileService = {
    editProfile, updatePassword, uploadProfile, getProfile
}

export default ProfileService;