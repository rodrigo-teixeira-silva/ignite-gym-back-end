import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { HStack, VStack, FlatList, Heading,Text } from "native-base";

import { appNavigatorRoutesProps } from "@routes/app.routes";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExercisesCard } from "@components/ExercisesCard";

export function Home(){
    const [Groups, setGroups] = useState(["Costas","Biceps","Triceps","Ombro"])
    const [groupSelected, setGroupSelected] = useState('Costas');

    const navigation = useNavigation<appNavigatorRoutesProps>();
    
    function handleOpenExercicesDetails(){
        navigation.navigate('exercises');
    }

    return(
        <VStack flex={1}>
        <HomeHeader/>

        <FlatList 
            data={Groups}
            keyExtractor={item => item}
            renderItem={ ({item})=>(
                <Group 
                name={item}
                isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
                onPress={ () => setGroupSelected(item)}
                />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            _contentContainerStyle={{ px:8 }}
            my={10}
            maxH={10}
        />
        <VStack flex={1} px={8}>
            <HStack justifyContent="space-between" mb={5}>
                <Heading color="gray.200" fontSize="md">
                    Exercicios
                </Heading>

                <Text color="gray.200" fontSize="sm">
                    4
                </Text>
            </HStack>
            <ExercisesCard
                onPress={handleOpenExercicesDetails}
            />

        </VStack>
    </VStack>
    );
}