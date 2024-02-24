import axios from "axios"
import useAuth from "./Auth/useAuth";



const useAxios = () => {

    const {Token } =useAuth();


    const axiosInstance = axios.create({
        baseURL: "http://192.168.14.40:8000",
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${Token}`,
        }
    });


    return axiosInstance;
}

export default useAxios
