import { HStack,Heading,Image, VStack, Text, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Entypo } from '@expo/vector-icons'
import { ExerciseDTO } from "@dtos/ExerciseDTO";

import { api } from "@services/api";
import { ItemClick } from "native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types";

type Props = TouchableOpacityProps & {
 data: ExerciseDTO;
};

export function ExercisesCard({data, ...rest}: Props){
    return(
        <TouchableOpacity {...rest}>
<HStack bg="gray.500" alignItems="center" p={2} pr={4} rounded="md" marginBottom={3}>
    <Image
    source={{uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`}}
    alt='Imagem de exercício'
    w={16}
    h={16}
    rounded="md"
    mr={4}
    resizeMode="center"
    />
    
    <VStack flex={1}>
        <Heading fontSize="lg" color="white" >
          {data.name}
        </Heading>

        <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>

        {data.series} séries x {data.repetitions} repetições 
        
        </Text>
    </VStack>

        <Icon as={Entypo} name="chevron-thin-right" color="gray.300"/>
    </HStack>
        </TouchableOpacity>
    );
}