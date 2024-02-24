import { Stack } from "expo-router"
import { Text, View } from "react-native"

const UnAuthStack = () => {
  return (
      <Stack>
          <Stack.Screen name="/accounts/login" />
          <Stack.Screen name="/accounts/signup" />
      </Stack>

  )
}

export default UnAuthStack
