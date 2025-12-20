import { toast } from "react-toastify";
import API from "../../api";

const getRoles = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/roles?page=${page}`);
        return response.data.roles
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}


const addRole = async (id, name, can_register, can_register_business) => {
    try {
        const response = await API.post("/dashboard/roles/add", { id, name, can_register, can_register_business });
        if (response.data.success) {
            toast.success(response.data.success, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
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
            if (error.response.data.errors.can_register) {
                toast.error(error.response.data.errors.can_register[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.can_register_business) {
                toast.error(error.response.data.errors.can_register_business[0], {
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
        console.log("Failed! ", error?.response?.data || error.message);
    }
}

const getRole = async (id) => {
    try {
        const response = await API.get(`/dashboard/roles/view/${id}`);
        return response.data
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}
const addPermissions = async (id, permissions) => {
    try {
        const response = await API.post("/dashboard/roles/permissions/add", { id, permissions });
        if (response.data.success) {
            toast.success(response.data.success, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                toast.error(error.response.data.errors.id[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.name) {
                toast.error(error.response.data.errors.permissions[0], {
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
        console.log("Failed! ", error?.response?.data || error.message);
    }
}

const addRoleSettings = async (id, role_id,name,description, field_type, status) => {
    try {
        const response = await API.post("/dashboard/roles/settings/add", { id, role_id,name,description, field_type, status });
        if (response.data.success) {
            toast.success(response.data.success, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                toast.error(error.response.data.errors.id[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.name) {
                toast.error(error.response.data.errors.permissions[0], {
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
            if (error.response.data.errors.field_type) {
                toast.error(error.response.data.errors.field_type[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.role_id) {
                toast.error(error.response.data.errors.role_id[0], {
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
        console.log("Failed! ", error?.response?.data || error.message);
    }
}

const getRoleSettings = async (id, page = 1) => {
    try {
        const response = await API.get(`/dashboard/roles/settings/${id}?page=${page}`);
        return response.data.role_settings
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}

const RolesService = {
    getRoles,addRole, getRole, addPermissions, addRoleSettings, getRoleSettings
}

export default RolesService