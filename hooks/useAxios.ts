import axios from "axios";
import constants from "./constants";
import useAuth from "./Auth/useAuth";
import * as SecureStorage from "expo-secure-store";

const useAxios = () => {
    const {
        accessToken,
        setAccessToken,
        refreshToken,
        unAuthenticateUser,
        user,
    } = useAuth();
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
            if (
                error.response &&
                error.response.status === 401 &&
                !error.config._retry
            ) {
                error.config._retry = true;
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
                        throw new Error("Failed to refresh token");
                    }

                    const { access } = await refreshResponse.json();
                    // Update accessToken in the axios instance header
                    axiosInstance.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${access}`;
                    // Update access token in storage
                    const authState = { access, refresh: refreshToken, user };
                    await SecureStorage.setItemAsync(
                        "auth_state",
                        JSON.stringify(authState)
                    );

                    // Retry original request with new token
                    return axiosInstance(error.config);
                } catch (refreshError) {
                    unAuthenticateUser();
                    // Handle refresh token failure
                    console.error("Failed to refresh token:", refreshError);
                    // You may choose to logout or do other error handling here
                    return Promise.reject(refreshError);
                }
            }
            // Handle other errors
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;
