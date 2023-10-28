
import {  StatusBar, Text, View } from 'react-native';
import { NativeBaseProvider } from 'native-base'
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { Routes } from './src/routes';

import { AuthContextProvider } from '@contexts/AuthContext';

import { AuthContext } from '@contexts/AuthContext';

import { THEME } from './src/theme'
import { Loading } from '@components/loading';

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

