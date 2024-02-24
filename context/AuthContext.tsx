import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useEffect,
    useState,
} from "react";
import { UserType } from "../hooks/types";

const baseURL = "";

interface AuthContextType {
    user: UserType | null;
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    setUser: Dispatch<SetStateAction<UserType | null>>;
    setFastRefresh: Dispatch<SetStateAction<boolean>>;
    }

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    setUser: () => {},
    setFastRefresh: () => {},
    });

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [fastRefresh, setFastRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(true);



    const contextData = {
        isAuthenticated,
        user,
        setIsAuthenticated,
        setUser,
        setFastRefresh,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
