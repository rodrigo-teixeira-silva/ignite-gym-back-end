import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import {VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base'
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

import { AuthNavigationRoutesProps } from "@routes/auth.routes"; 

import { useAuth } from "@hooks/useAuth"

import BackgroundImg from '@assets/background.png';

import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/input';
import { Button } from '@components/button';
import { AppError } from "@utils/AppError"

type FormData = {
    email: string;
    password: string;

}

const SignInSchema = yup.object({
    email: yup.string().required('Informe o E-mail.').email('E-mail inválido.'),
    password: yup.string().required('Informe a senha.').min(6, 'Asenha deve ter palo menos 6 digitos.')
});

export function SignIn(){
    const [isLoading, setIsLoading] = useState(false);
    const { SignIn } = useAuth();
  
    const { control, handleSubmit, formState: {errors} } = useForm<FormData>({
         resolver: yupResolver(SignInSchema)
    });

    const navigation = useNavigation<AuthNavigationRoutesProps>();

    const toast = useToast();


    function handleNewAccount(){
    navigation.navigate('signUp');   
    }
    
    async function handleSignIn({ email, password }: FormData){
      try {
        setIsLoading(true);
        await SignIn(email, password);
        
      } catch (error) {

        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : 'Não foi possivel entrar. Tente novamente mais tarde.'
        
        setIsLoading(false);

        toast.show({
            title,
            placement: 'top',
            bgColor:'red.500'
        });

       
      }
    }

    return(
      <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <VStack flex={1}  px={10} pb={16}>
            <Image
            source={BackgroundImg}
            defaultSource={BackgroundImg}
            alt="Pessoas treinando"
            resizeMode="contain"
            position="absolute"
            />
        <Center my={24}>

            <LogoSvg/>

            <Text color="gray.100" fontSize="sm">
                Treine sua mente e o seu corpo
            </Text>
            
        </Center>    

        <Center>

            <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                Acesse a sua conta 
            </Heading>

            <Controller
                control={control}
                name= "email"
                    render={({ field: {onChange, value}})=>(
                    <Input  placeholder='E-mail'
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.email?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name= "password"
                    render={({ field: {onChange, value}})=>(
                    <Input placeholder='Senha'
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                    onSubmitEditing={handleSubmit(handleSignIn)}
                    returnKeyType="send"
                    errorMessage={errors.password?.message}
                    />
                )}
            />


            <Button title="acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
            />

        </Center>

        <Center mt={24}>

            <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
                Ainda não tem acesso?
            </Text>

            <Button 
                title="Criar conta" 
                variant="outline"
                onPress={handleNewAccount}

            />
        </Center>
    </VStack>
    </ScrollView>
    );
}