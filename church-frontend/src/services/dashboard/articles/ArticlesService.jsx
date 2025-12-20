import { toast } from "react-toastify";
import API from "../../api";

const getArticles = async (page = 1) => {
    try {
        const response = await API.get(`/dashboard/articles?page=${page}`);
        return response.data.articles
        
    } catch (error) {
       // console.log(error);
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000, // Closes after 3s
        });
        return null;
    }
}


const addArticle =  async (formData) => {
    try {
        const response = await API.post("/dashboard/articles/add", formData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.data?.success) {
            toast.success(response.data?.success, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        return true;
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                toast.error(error.response.data.errors.id, {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.content) {
                toast.error(error.response.data.errors.content[0], {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.title) {
                toast.error(error.response.data.errors.title[0], {
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

const uploadArticleImage =  async (file) => {
    try {
        const formData = new FormData();
        formData.append("image", file);
        const response = await API.post("/dashboard/articles/upload", formData, {
            /*headers: {
                "Content-Type": "application/json"
            },*/
        });
        if (response.data?.success) {
            toast.success(response.data?.success, {
                position: "top-right",
                autoClose: 3000, // Closes after 3s
            });
        }
        return response.data;
    } catch (error) {
        if (error.response.data.errors) {
            if (error.response.data.errors.id) {
                toast.error(error.response.data.errors.id, {
                    position: "top-right",
                    autoClose: 3000, // Closes after 3s
                });
            }
            if (error.response.data.errors.delivery_person) {
                toast.error(error.response.data.errors.delivery_person[0], {
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

const getArticle = async (id) => {
    try {
        const response = await API.get(`/dashboard/articles/view/${id}`);
        return response.data.article;
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

const ArticlesService = {
    getArticles, getArticle, addArticle, uploadArticleImage,
}

export default ArticlesService