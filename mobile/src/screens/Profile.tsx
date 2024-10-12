import { useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  Heading,
  useToast,
  Toast,
} from "native-base";
import * as ImagePiker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

import { Controller, useForm } from "react-hook-form";

import { api } from "../service/api";

import { useAuth } from "@hooks/useAuth";

import defaultUserPhoto from '@assets/userPhotoDefault.png'

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/input";
import { Button } from "@components/button";
import { AppError } from "@utils/AppError";


const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 dígitos.').nullable().transform((value) => !!value ? value : null),
    confirm_password: yup.string().nullable().transform((value) => !!value ? value : null).oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.'),
  })

// const profileSchema = yup.object({
//   name: yup.string().required("Informe o nome"),
//   password: yup.string().min(6, 'A senha deve ter oelo menos 6 caracteres').nullable().transform((value)=> !!value ? value : null),
//   confirm_password: yup.string()
//   .nullable().transform((value) => !!value ? value : null)
//   .oneOf([yup.ref('password'), null], 'A confirmação de senha não conferem.')
//   .when('password', {
//     is: (Field: any) => Field,
//     then: yup
//     .string()
//     .nullable()
//     .required('Informe a confirmação da senha')
//     .transform((value)=> !!value ? value : null),
// }) 
// });

export function Profile() {
  const [ isUpdating, setIsUpdating ] = useState(false);

  const [photoIsLoading, setPhotoIsLoading] = useState(false);

 

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  async function handleProfileUpdate(data: FormDataProps) {
    try {
        setIsUpdating(true);

        const userUpdated = user;
        userUpdated.name =data.name;

        await api.put('/users', data);

        await updateUserProfile(userUpdated);

        Toast.show({
            title: 'Perfil atualizado com sucesso!',
            placement:'top',
            bgColor:'green.500'
        });

       
    } catch (error) {
        const isApperror = error instanceof AppError;
        const title = isApperror ? error.message : 'Não foi possível  atualizar os dados. Tente novamente mais tarde.'

        Toast.show({
            title: 'Perfil atualizado com sucesso!',
            placement:'top',
            bgColor:'green.500'
        });

    } finally {
        setIsUpdating(false);
    }
  }

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);

    try {
      const photoSelected = await ImagePiker.launchImageLibraryAsync({
        mediaTypes: ImagePiker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.uri);
        

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: '"Essa imagem e muito grande. Selecione uma até 5MB"',
            placement: "top",
            bgColor: "red.500",
          });
        }

        const fileExtention = photoSelected.uri.split('.').pop();
       

        const photoFile = {
            name: `${user.name}.${fileExtention}`.toLowerCase(),
            uri: photoSelected.uri,
            type:`${photoSelected.type}/${fileExtention}`
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append('avatar', photoFile);

        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
        updateUserProfile(userUpdated);

        toast.show({
            title: 'Foto atualizada!',
            placement: 'top',
            bgColor: 'green.500'
          })
        }
      
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }
  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
            source={
                user.avatar 
                ? 
                { uri:`${api.defaults.baseURL}/avatar/${user.avatar}`}
                : defaultUserPhoto 
            }
              alt="foto do usuário "
              size={PHOTO_SIZE}
            />
          )}
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Center>

        <Center px={10} mt={12} mb={9}>
          <Heading
            color="gray.200"
            fontSize="md"
            mb={2}
            alignSelf="flex-start"
            mt={0}
          >
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { value, onChange } }) => (
              <Input bg="gray.600" 
              placeholder="Senha antiga" 
              secureTextEntry 
              onChangeText={onChange}
              value={value} />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha "
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />
          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
