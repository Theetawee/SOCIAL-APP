import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useEffect,
    useState,
} from "react";
import { UserType } from "../hooks/types";
import SecureStore from "expo-secure-store";
import constants from "@/hooks/constants";
import axios from "axios";


interface AuthContextType {
    user: UserType | null;
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    setUser: Dispatch<SetStateAction<UserType | null>>;
    setFastRefresh: Dispatch<SetStateAction<boolean>>;
    setAccessToken: Dispatch<SetStateAction<string | null>>;
    access: string | null;
    setRefreshToken: Dispatch<SetStateAction<string | null>>;
    refreshToken: string | null;
    authenticateUser: (user:UserType,access:string,refresh:string) => void;
    }

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    setUser: () => {},
    setFastRefresh: () => { },
    setAccessToken: () => { },
    access: null,
    setRefreshToken: () => { },
    refreshToken: null,
    authenticateUser: () => {},
    });

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [fastRefresh, setFastRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [access, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const { baseUrl} = constants();

    const authenticateUser = async (user:UserType,access:string,refresh:string) => {
        setIsAuthenticated(true);
        setIsLoading(false);
        setFastRefresh(false);
        setUser(user);
        await SecureStore.setItemAsync('user', JSON.stringify(user));
        await SecureStore.setItemAsync('access', access);
        await SecureStore.setItemAsync('refresh', refresh);
    }

    const unAuthenticateUser=async()=>{
        setIsAuthenticated(false);
        setIsLoading(false);
        setFastRefresh(false);
        setUser(null);
        await SecureStore.deleteItemAsync('user');
        await SecureStore.deleteItemAsync('access');
        await SecureStore.deleteItemAsync('refresh');
    }


    const api = axios.create({
        baseURL: baseUrl,
        headers: {
            Authorization: `Bearer ${access}`,
        },

    })


    useEffect(() => {
        const getAccessToken = async () => {
            const token = await SecureStore.getItemAsync('access');
            setAccessToken(token||null);
        }
        const getRefreshToken = async () => {
            const token = await SecureStore.getItemAsync('refresh');
            setRefreshToken(token||null);
        }
        getAccessToken();
        getRefreshToken();

    }, [])


    useEffect(() => {
        const refreshToken = async () => {
            try {
                const response = await api.post('/accounts/token/refresh/')
                const { access } = response.data
                setAccessToken(access);
            } catch {
                unAuthenticateUser();
            }

        }
        if (refreshToken) {
            refreshToken();
        }
    },[fastRefresh,refreshToken])





    const contextData = {
        isAuthenticated,
        user,
        setIsAuthenticated,
        setUser,
        setFastRefresh,
        setAccessToken,
        access,
        setRefreshToken,
        refreshToken,
        authenticateUser
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
