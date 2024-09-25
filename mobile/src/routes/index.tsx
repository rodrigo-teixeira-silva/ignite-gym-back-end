import { useContext } from "react";

import { useTheme, Box } from "native-base";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { AuthRoutes } from "./auth.routes";

import { AppRoutes } from "./app.routes";


import { useAuth } from "@hooks/useAuth";
import { convertAbsoluteToRem } from "native-base/lib/typescript/theme/tools";
import { Loading } from "@components/loading";

export function Routes() {
  const { colors } = useTheme();

  const { user, isLoadingUserStorageData } = useAuth();

 // console.log("USUARIO LOGADO =>", user);

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

if(isLoadingUserStorageData){
  return <Loading/>
}

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
