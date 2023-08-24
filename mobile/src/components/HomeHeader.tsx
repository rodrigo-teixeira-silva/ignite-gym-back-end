import { Heading, HStack, Icon, Text, VStack } from 'native-base';

import {MaterialIcons} from '@expo/vector-icons'

import { UserPhoto } from './UserPhoto';
import { TouchableOpacity } from 'react-native';

export { Heading } from 'native-base';

export function HomeHeader(){
    return(
  
        <HStack background= "gray.600" pt={16} pb={5} px={8} alignItems="center">
            <UserPhoto
                source={{ uri: 'https://github.com/linkdri1.png' }}
                alt='Imagem do usuário'
                size={16}
                mr={4}
            />

            <VStack flex={1}>
            <Text color="gray.100" fontSize="md">
                Olá
            </Text>
      
     No heading foi definido o font family pois no ios não estava reconhecendo como negrito 

        <Heading color="gray.100" fontSize="md" fontFamily="heading">
            Rodrigo
        </Heading>
        </VStack>

        <TouchableOpacity>
        <Icon 
        as={MaterialIcons} 
        name='logout'
        color="gray.200"
        size={7}
        />
        </TouchableOpacity>
        
     </HStack>
    );
}