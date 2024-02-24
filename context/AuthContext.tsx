import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useEffect,
    useState,
} from "react";
import { UserType } from "../hooks/types";
import * as SecureStore from "expo-secure-store";
import constants from "@/hooks/constants";
import axios from "axios";
import { ActivityIndicator, View } from "react-native";
import LoadingState from "@/components/LoadingState";

interface AuthContextType {
    user: UserType | null;
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    setUser: Dispatch<SetStateAction<UserType | null>>;
    setFastRefresh: Dispatch<SetStateAction<boolean>>;
    setAccessToken: Dispatch<SetStateAction<string | null>>;
    accessToken: string | null;
    setRefreshToken: Dispatch<SetStateAction<string | null>>;
    refreshToken: string | null;
    authenticateUser: (user: UserType, access: string, refresh: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    setUser: () => {},
    setFastRefresh: () => {},
    setAccessToken: () => {},
    accessToken: null,
    setRefreshToken: () => {},
    refreshToken: null,
    authenticateUser: () => {},
});

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [userInfo, setUser] = useState<UserType | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [fastRefresh, setFastRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const { baseUrl } = constants();

    const authenticateUser = async (
        user: UserType,
        access: string,
        refresh: string
    ) => {
        setIsAuthenticated(true);
        setIsLoading(false);
        setFastRefresh(false);
        setUser(user);
        setAccessToken(access);
        setRefreshToken(refresh);
        try {
            await SecureStore.setItemAsync("user", JSON.stringify(user));
            await SecureStore.setItemAsync("access", access);
            await SecureStore.setItemAsync("refresh", refresh);
        } catch (error) {
            console.log(error);
        }
    };

    const unAuthenticateUser = async () => {
        setIsAuthenticated(false);
        setIsLoading(false);
        setFastRefresh(false);
        setUser(null);
        await SecureStore.deleteItemAsync("user");
        await SecureStore.deleteItemAsync("access");
        await SecureStore.deleteItemAsync("refresh");
    };

    const api = axios.create({
        baseURL: baseUrl,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await SecureStore.getItemAsync("access");
                setAccessToken(token);
            } catch {
                setAccessToken(null);
            }
        };
        const getRefreshToken = async () => {
            try {
                const token = await SecureStore.getItemAsync("refresh");
                setRefreshToken(token);
            } catch {
                setRefreshToken(null);
            }
        };
        getAccessToken();
        getRefreshToken();
    }, []);

    useEffect(() => {
        const refreshTokens = async () => {
            try {
                const response = await api.post("/accounts/token/refresh/");
                const { access } = response.data;
                setAccessToken(access);
            } catch (error) {
                unAuthenticateUser();
            }
        };
        if (refreshToken) {
            refreshTokens();
        } else {
            setIsLoading(false);
        }
    }, [fastRefresh, refreshToken]);

    const contextData = {
        isAuthenticated,
        user: userInfo,
        setIsAuthenticated,
        setUser,
        setFastRefresh,
        setAccessToken,
        accessToken,
        setRefreshToken,
        refreshToken,
        authenticateUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {isLoading ? (
                <>
                    <LoadingState/>
                </>
            ) : (
                <>{children}</>
            )}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
