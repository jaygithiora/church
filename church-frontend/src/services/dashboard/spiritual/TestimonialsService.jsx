import API from "../../api";

const getTestimonials = async (page = 1, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/spiritual/testimonials?page=${page}`);
        return response.data.testimonials;
        
    } catch (error) {
       // console.log(error);
        enqueueSnackbar(error.message, {variant:"error"});
        return null;
    }
}


const addTestimonial =  async (formData, enqueueSnackbar) => {
    try {
        const response = await API.post("/dashboard/spiritual/testimonials/add", formData, {
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
            if (error.response.data.errors.testimonial) {
                enqueueSnackbar(error.response.data.errors.testimonial[0],{variant:"error"});
            }
            if (error.response.data.errors.status) {
                enqueueSnackbar(error.response.data.errors.status[0],{variant:"error"});
            }
        }

        if (error.response.data.error) {
            enqueueSnackbar(error.response.data.error, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        if(error.message){
            
            enqueueSnackbar(error.message, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return false;
}

const getTestimonial = async (id, enqueueSnackbar) => {
    try {
        const response = await API.get(`/dashboard/spiritual/testimonials/view/${id}`);
        return response.data.testimonial;
    } catch (error) {
        if (error.response.data.error) {
            enqueueSnackbar(error.response.data.error, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        if(error.message){
            
            enqueueSnackbar(error.message, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        console.log("Failed! ", error?.response?.data || error.message);
    }
    return null;
}

const TestimonialsService = {
    getTestimonials, addTestimonial, getTestimonial
}

export default TestimonialsService