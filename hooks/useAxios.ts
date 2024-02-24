import axios from "axios"



const useAxios = () => {
    const axiosInstance = axios.create({
        baseURL: "http://192.168.8.169:8000",
        withCredentials: true,
    });


    return axiosInstance;
}

export default useAxios
