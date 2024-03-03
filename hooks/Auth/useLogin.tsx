import useAuth from "./useAuth";
import axios from "axios";
import constants from "../constants";
import { useRouter } from "expo-router";
import { useState } from "react";

const useLogin = () => {
    const [isLoading,setIsLoading]=useState(false)
    const router = useRouter();
    const { baseUrl} = constants();
    const {authenticateUser,setIsAuthenticated } = useAuth();
    const api = axios.create({
        baseURL:baseUrl
    })


    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const response = await api.post('/accounts/login/', {
                email,
                password
            })

            const { access, refresh, user } = response.data
            authenticateUser(user, access, refresh)
            router.push('/')

        } catch (error) {
            alert('Can\'t process login with provided credentials!' )
        } finally {
            setIsLoading(false)
        }

    }


  return {
      login,
      isLoading
  }
}

export default useLogin
