import { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { HStack, VStack, FlatList, Heading,Text, useToast } from "native-base";

import { api } from "@services/api";

import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { AppError } from "@utils/AppError";
import { appNavigatorRoutesProps } from "@routes/app.routes";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExercisesCard } from "@components/ExercisesCard";
import { Loading } from "@components/loading";

export function Home(){
    const [isLoading, setIsLoading] = useState(true)
    const [Groups, setGroups] = useState([]);
    const [ exercises, setExercises] = useState<ExerciseDTO[]>([]);
    const [groupSelected, setGroupSelected] = useState('antebraço');

    const toast = useToast();
    const navigation = useNavigation<appNavigatorRoutesProps>();
    
    function handleOpenExercicesDetails(exerciseId: string){
        navigation.navigate('exercises',{ exerciseId });
    }

    async function fetchGroups() {
      try{
      
        const response  = await api.get('/groups');
        setGroups(response.data);

      } catch(error) { 
        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares';

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500'
        }); 
      }
    }

      async function fetchExercisesByGroup(){
        try {
          setIsLoading(true);

          const response = await api.get(`/exercises/bygroup/${groupSelected}`)
          setExercises(response.data);

        } catch(error) { 
          const isAppError = error instanceof AppError;
          const title = isAppError ? error.message : 'Não foi possível carregar os exercícios';
  
          toast.show({
            title,
            placement: 'top',
            bgColor: 'red.500'
          }); 
        } finally {
          setIsLoading(false)
        }
    } 

    useEffect(() => {
      fetchGroups();
    }, [])

    useFocusEffect(useCallback(() => {
      fetchExercisesByGroup();
    }, [groupSelected]));

    return(
        <VStack flex={1}>
        <HomeHeader/>

        <FlatList 
            data={Groups}
            keyExtractor={item => item.id}
            renderItem={ ({item})=>(
                <Group 
                name={item}
                isActive= { groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
      
                onPress={ () => setGroupSelected(item)}
                />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            _contentContainerStyle={{ px:8 }}
            my={10}
            maxH={10}
        />
      {
        isLoading ? < Loading/> :

          <VStack flex={1} px={8}>
            <HStack justifyContent="space-between" mb={5}>

              <Heading color="gray.200" fontSize="md">
                Exercicios
              </Heading>

              <Text color="gray.200" fontSize="sm">
                {exercises.length}
              </Text>
            </HStack>

              <FlatList 
                data={exercises}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <ExercisesCard
                    onPress={ () => handleOpenExercicesDetails(item.id)}
                    data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20
            }}
          />
          </VStack>
        }
    </VStack>
  );
}