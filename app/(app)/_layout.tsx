import useAuth from "@/hooks/Auth/useAuth";
import { Redirect, Stack } from "expo-router";

const _layout = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect href={"/login"} />;
    }
       return <Stack />;

};

export default _layout;
