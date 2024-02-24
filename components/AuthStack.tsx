import { Stack } from "expo-router";

const AuthStack = () => {
  return (
      <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
  );
}

export default AuthStack
