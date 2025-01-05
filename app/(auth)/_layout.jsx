import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerShadowVisible: false,
        //manuelles erstellen vom zurück Button, mit navigation
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          </TouchableOpacity>
        ),
      })}
    >
      
      <Stack.Screen name='onboarding' options={{ headerShown: false }} />
      <Stack.Screen name='login' options={{ title: "Bei BOOKR anmelden" }} />
      <Stack.Screen name='sign-up' options={{ headerShown: false }} />
      <Stack.Screen name='sign-up-email' options={{ title: "Mit E-mail registrieren" }} />
    </Stack>
  );
};

export default AuthLayout;