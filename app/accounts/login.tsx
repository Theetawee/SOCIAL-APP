import { Stack } from "expo-router";
import { Text, View } from "react-native";

const login = () => {
    return (
        <>
            <Stack.Screen name="/accounts/login" options={{headerTitle: "Login"}}/>
            <View>
                <Text>Login</Text>
            </View>
        </>
    );
};

export default login;
