import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="searchResults/[input]" // searchresults page
        options={{ headerShown: false }}
      />
        <Stack.Screen 
        name="bookpage" // bookpage
        options={{ headerShown: false }}
      />
    </Stack>
  );
}