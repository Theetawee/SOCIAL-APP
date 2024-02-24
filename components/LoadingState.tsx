import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Text } from "react-native";

const LoadingState = () => {
  return (
      <View className="h-screen flex items-center justify-center">
          <View>
              <ActivityIndicator size={"large"} color={"#0284c7"} />
              <Text className="font-medium mt-4">Connecting Waanverse</Text>
          </View>
          <StatusBar style="dark" />
      </View>
  );
}

export default LoadingState
