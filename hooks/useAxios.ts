import axios from "axios";
import constants from "./constants"; // Assuming this is where you get baseUrl
import useAuth from "./Auth/useAuth";
import * as SecureStorage from "expo-secure-store";

const useAxios = () => {
    const { accessToken, setAccessToken, refreshToken,unAuthenticateUser } = useAuth();
    const { baseUrl } = constants();

    const axiosInstance = axios.create({
        baseURL: baseUrl,
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    // Add interceptor to handle unauthorized requests
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    // Refresh token
                    const refreshResponse = await fetch(
                        `${baseUrl}/accounts/token/refresh/`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                refresh: refreshToken,
                            }),
                        }
                    );

                    if (!refreshResponse.ok) {
                        unAuthenticateUser();
                    }

                    const { access } = await refreshResponse.json();
                    // Update accessToken in both the axios instance and state
                    axiosInstance.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${access}`;
                    setAccessToken(access);
                    SecureStorage.setItemAsync("access", access);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // If refreshing token fails, log the error or handle as needed
                    unAuthenticateUser();
                    // You may choose to logout or do other error handling here
                }
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;
