
import {  StatusBar, Text, View } from 'react-native';
import { NativeBaseProvider } from 'native-base'
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { Routes } from './src/routes';

import { Loading } from '@components/loading';

import { THEME } from './src/theme'

export default function App() {
 
    const [fontLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold }); 
  return (
    <NativeBaseProvider theme={THEME}> 
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
    />

      {fontLoaded ? <Routes/> : <Loading/>}

    </NativeBaseProvider>
  );
}

