import {  StatusBar } from 'react-native';
import   OneSignal  from 'react-native-onesignal';
import { NativeBaseProvider } from 'native-base'
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { Routes } from './src/routes';

import { AuthContextProvider } from '@contexts/AuthContext';

import { THEME } from './src/theme'
import { Loading } from '@components/loading';

OneSignal.setAppId('7286543d-0d19-4c01-8591-3f28b9041c8c');

export default function App() {
 
    const [fontLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold }); 
  return (
    <NativeBaseProvider theme={THEME}> 
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
    />
      <AuthContextProvider>
        {fontLoaded ? <Routes/> : <Loading/>}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}

