import { createContext, ReactNode, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import LoadingState from "@/components/LoadingState";
import { UserType } from "../hooks/types";
import constants from "@/hooks/constants";

interface AuthContextType {
    user: UserType | null;
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    setUser: (value: UserType | null) => void;
    setAccessToken: (value: string | null) => void;
    accessToken: string | null;
    setRefreshToken: (value: string | null) => void;
    refreshToken: string | null;
    authenticateUser: (user: UserType, access: string, refresh: string) => void;
    unAuthenticateUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    setUser: () => {},
    setAccessToken: () => {},
    accessToken: null,
    setRefreshToken: () => {},
    refreshToken: null,
    authenticateUser: () => {},
    unAuthenticateUser: () => {},
});

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [userInfo, setUser] = useState<UserType | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { baseUrl } = constants();

    const authenticateUser = async (
        user: UserType,
        access: string,
        refresh: string
    ) => {
        try {
            const authState = { access, refresh, user };
            await SecureStore.setItemAsync(
                "auth_state",
                JSON.stringify(authState)
            );
            setIsAuthenticated(true);
            setUser(user);
            setAccessToken(access);
            setRefreshToken(refresh);
        } catch (error) {
            console.log("Error while authenticating user:", error);
        }
    };

    const unAuthenticateUser = async () => {
        try {
            await SecureStore.deleteItemAsync("auth_state");
        } catch (error) {
            console.log("Error while unauthenticating user:", error);
        }
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        const getAuthState = async () => {
            try {
                const authState = await SecureStore.getItemAsync("auth_state");
                if (authState) {
                    const { user, access, refresh } = JSON.parse(authState);
                    setUser(user);
                    setAccessToken(access);
                    setRefreshToken(refresh);
                    setIsAuthenticated(true);
                } else {
                    setAccessToken(null);
                    setRefreshToken(null);
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.log("Error while getting authentication state:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        getAuthState();
    }, []);

    const contextData: AuthContextType = {
        isAuthenticated,
        user: userInfo,
        setIsAuthenticated,
        setUser,
        setAccessToken,
        accessToken,
        setRefreshToken,
        refreshToken,
        authenticateUser,
        unAuthenticateUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {isLoading ? <LoadingState /> : <>{children}</>}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
