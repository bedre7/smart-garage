import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import useCustomFont from './src/hooks/useCustomFont';
import AppStack from './src/navigation/AppStack';
import AuthContextProvider from './src/context/auth-context';
import HomeStack from './src/navigation/HomeStack';
import { StatusBar } from 'expo-status-bar';

const App = () => {
  const [fontsLoaded] = useCustomFont();

  if (!fontsLoaded) return <AppLoading />;

  return (
    <AuthContextProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        {/* <AppStack /> */}
        <HomeStack />
      </NavigationContainer>
    </AuthContextProvider>
  );
};

export default App;
