import { Slot, Stack } from "expo-router";
export default function QuestionsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="swiper" ></Stack.Screen>
    </Stack>
  )
}