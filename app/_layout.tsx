import AuthContextProvider from "@/context/AuthContext";
import useAuth from "@/hooks/Auth/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";

function RootLayout() {
    const { isAuthenticated } = useAuth();
    return (
        <QueryClientProvider client={new QueryClient()}>
            <AuthContextProvider>
                <Slot/>
            </AuthContextProvider>
        </QueryClientProvider>
    );
}

export default RootLayout;
