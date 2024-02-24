import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { UserType } from "../hooks/types";
import * as SecureStore from "expo-secure-store";
import constants from "@/hooks/constants";
import axios from "axios";
import LoadingState from "@/components/LoadingState";

interface AuthContextType {
    user: UserType | null;
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    setUser: Dispatch<SetStateAction<UserType | null>>;
    setAccessToken: Dispatch<SetStateAction<string | null>>;
    accessToken: string | null;
    setRefreshToken: Dispatch<SetStateAction<string | null>>;
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
    authenticateUser: () => { },
    unAuthenticateUser: () => {},
});

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [userInfo, setUser] = useState<UserType | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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
        setUser(user);
        setAccessToken(access);
        setRefreshToken(refresh);
        try {
            await SecureStore.setItemAsync("user", JSON.stringify(user));
            await SecureStore.setItemAsync("access", access);
            await SecureStore.setItemAsync("refresh", refresh);
        } catch (error) {
        }
    };

    const unAuthenticateUser = async () => {
        setIsAuthenticated(false);
        setIsLoading(false);
        setUser(null);
        await SecureStore.deleteItemAsync("user");
        await SecureStore.deleteItemAsync("access");
        await SecureStore.deleteItemAsync("refresh");
    };

    const api = axios.create({
        baseURL: baseUrl,
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
        const getUserInfo=async ()=>{
            try {
                const user = await SecureStore.getItemAsync("user");
                const userInfo:UserType=JSON.parse(user!)
                setUser(userInfo);
            } catch {
                setUser(null);
            }
        }
        getAccessToken();
        getRefreshToken();
        getUserInfo();



    }, []);

    useEffect(() => {


            const refreshTokens = async () => {
                try {
                    const response = await api.post("/accounts/token/refresh/", {
                        refresh: refreshToken,
                    });
                    const { access } = response.data;
                    setAccessToken(access);
                    setIsAuthenticated(true);
                    setIsLoading(false);
                    await SecureStore.setItemAsync('access', access)
                } catch (error) {
                    unAuthenticateUser();
                }
        };

           if(refreshToken && accessToken){
               setIsAuthenticated(true);
           }
            if (isAuthenticated) {
            refreshTokens();
        }

        if (!isAuthenticated && !refreshToken) {
            setIsLoading(false);
        }

    }, [refreshToken,isAuthenticated]);

    const contextData = {
        isAuthenticated,
        user: userInfo,
        setIsAuthenticated,
        setUser,
        setAccessToken,
        accessToken,
        setRefreshToken,
        refreshToken,
        authenticateUser,
        unAuthenticateUser
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
