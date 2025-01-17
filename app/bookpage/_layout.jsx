import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        unmountOnBlur: true, // komponente wird immer neu erstellt und zustände werden zurückgesetzt, so muss ich wenn ich auf ein buch in empfehlungen klicke nicht manuell hochscrollen sondern es sieht natürlich aus
        headerShown: false
      }}
    />
  );
}
