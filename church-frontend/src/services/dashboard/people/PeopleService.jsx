import API from "../../api";

const getPeople = async (page = 1, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/people?page=${page}`);
        return response.data.people
        
    } catch (error) {
       // console.log(error);
        enqueueSnackbar(error.message, {variant:"error"});
        return null;
    }
}


const addPerson =  async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/people/add", formData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            enqueueSnackbar(response.data?.success, {variant:"success"});
        }
        return true;
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                enqueueSnackbar(error.response.data.errors.id[0],{variant:"error"});
            }
            if (error.response.data.errors.name) {
                enqueueSnackbar(error.response.data.errors.name[0],{variant:"error"});
            }
            if (error.response.data.errors.description) {
                enqueueSnackbar(error.response.data.errors.description[0],{variant:"error"});
            }
            if (error.response.data.errors.user) {
                enqueueSnackbar(error.response.data.errors.user[0],{variant:"error"});
            }
            if (error.response.data.errors.role) {
                enqueueSnackbar(error.response.data.errors.role[0],{variant:"error"});
            }
            if (error.response.data.errors.age_group) {
                enqueueSnackbar(error.response.data.errors.age_group[0],{variant:"error"});
            }
        }

        if (error.response.data.error) {
            enqueueSnackbar(error.response.data.error, {
                variant:"error",
            });
        }
        if(error.message){
            
            enqueueSnackbar(error.message, {
                variant:"error",
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}


const getPerson = async (id, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/people/view/${id}`);
        return response.data.person
        
    } catch (error) {
       // console.log(error);
        enqueueSnackbar(error.message, {variant:"error"});
        return null;
    }
}

const getPersonMembers = async (id, page = 1, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/people/members/view/${id}?page=${page}`);
        return response.data.members
        
    } catch (error) {
       // console.log(error);
        enqueueSnackbar(error.message, {variant:"error"});
        return null;
    }
}

const getMembers = async (page = 1, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/people/members?page=${page}`);
        return response.data.members
        
    } catch (error) {
       // console.log(error);
        enqueueSnackbar(error.message, {variant:"error"});
        return null;
    }
}

const addMembers =  async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/people/members/add", formData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            enqueueSnackbar(response.data?.success, {variant:"success"});
        }
        return true;
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                enqueueSnackbar(error.response.data.errors.id[0],{variant:"error"});
            }
            if (error.response.data.errors.users) {
                enqueueSnackbar(error.response.data.errors.users[0],{variant:"error"});
            }
        }

        if (error.response.data.error) {
            enqueueSnackbar(error.response.data.error, {
                variant:"error",
            });
        }
        if(error.message){
            
            enqueueSnackbar(error.message, {
                variant:"error",
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}

const deleteMember =  async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/people/members/delete", formData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            enqueueSnackbar(response.data?.success, {variant:"success"});
        }
        return true;
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                enqueueSnackbar(error.response.data.errors.id[0],{variant:"error"});
            }
        }

        if (error.response.data.error) {
            enqueueSnackbar(error.response.data.error, {
                variant:"error",
            });
        }
        if(error.message){
            
            enqueueSnackbar(error.message, {
                variant:"error",
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}

const PeopleService = {
    getPeople, addPerson, getPerson, getPersonMembers, getMembers, deleteMember, addMembers
}

export default PeopleService