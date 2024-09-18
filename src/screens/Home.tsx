import { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { HStack, VStack, FlatList, Heading, Text, useToast } from "native-base";

import { api } from "../service/api";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@dtos/exerciseDTO";

import { appNavigatorRoutesProps } from "@routes/app.routes";

import { HomeHeader } from "@components/HomeHeader";
import { Loading } from "@components/loading";
import { Group } from "@components/Group";
import { ExercisesCard } from "@components/ExercisesCard";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [Groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState("Costas");

  const toast = useToast();
  const navigation = useNavigation<appNavigatorRoutesProps>();

  function handleOpenExercicesDetails(exercisesId: string) {
    navigation.navigate("exercises", {exercisesId});
  }

  async function fetGroups() {
    try {
      const response = await api.get("/groups");
      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os grupos musculares.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function fetchExercisesByGroups() {
    try {
      setIsLoading(true);

      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
     
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os exercícios.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroups();
    }, [groupSelected])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={Groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={
              groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()
            }
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
      />

      {isLoading ? (
        <Loading />
      ) : (
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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExercisesCard 
              onPress={()=>handleOpenExercicesDetails(item.id)} 
              data={item} 
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20,
            }}
          />
        </VStack>
      )}
    </VStack>
  );
}
