import { Stack } from "expo-router";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Input from "@/components/common/Input";
import { useState } from "react";
import useLogin from "@/hooks/Auth/useLogin";

const login = () => {
    const { login, isLoading } = useLogin();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = () => {
        if (!formData.email || !formData.password) {
            alert("All fields are requeired");
            return;
        }
        login(formData.email, formData.password);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    statusBarStyle: "dark",
                    title: "Login to Waanverse",
                    headerStyle: {
                        backgroundColor: "white",
                    },
                    headerShadowVisible: false,
                    headerTitleAlign: "center",
                }}
            />

            <View className="flex bg-white h-screen items-center px-4 py-16 ">
                <View className="max-w-md w-full mx-auto">
                    <View className="flex items-center mb-6">
                        <Ionicons
                            name="lock-closed"
                            size={50}
                            color="#333333"
                        />
                    </View>
                    <View className="w-full grid grid-cols-1 gap-y-4">
                        <View>
                            <Input
                                label="Email Address"
                                type="email-address"
                                value={formData.email}
                                onchange={(text) =>
                                    setFormData({
                                        ...formData,
                                        email: text,
                                    })
                                }
                            />
                        </View>
                        <View>
                            <Input
                                label="Password"
                                value={formData.password}
                                secure
                                onchange={(text) =>
                                    setFormData({
                                        ...formData,
                                        password: text,
                                    })
                                }
                            />
                        </View>
                        <View>
                            <View className="max-w-sm mt-4">
                                <Pressable
                                    disabled={isLoading}
                                    className={`bg-primary-600 ${
                                        isLoading ? "opacity-80" : "opacity-100"
                                    } px-5 py-2.5 text-white rounded`}
                                    onPress={handleSubmit}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color={"#ffffff"} />
                                    ) : (
                                        <Text className="text-white text-center text-base font-medium">
                                            Login
                                        </Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
};

export default login;
