import React, { useCallback, useRef, useContext } from 'react'
import * as Yup from 'yup' 
import { useNavigation } from '@react-navigation/native'
import {Image, ScrollView, Alert,KeyboardAvoidingView, Platform, TextInput ,View} from 'react-native'
import Input from '../../components/Input'
import Button from '../../components/Button'
import logoIgm from '../../assets/logo.png'

import { useAuth } from '../../hooks/auth'

import getValidationErros from '../../utils/getValidationErrors'

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import Icon from 'react-native-vector-icons/Feather'

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountButtonText } from './styles'

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const { signIn } = useAuth();

    const formRef = useRef<FormHandles>(null)
    const passwordRef = useRef<TextInput>(null)
    const navigation = useNavigation()

    const handleSignIn = useCallback(async (data: SignInFormData) => {
        try {
            formRef.current?.setErrors({})

            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail Obrigatório').email('Digite um E-mail válido'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos')
            })

            await schema.validate(data, {
                abortEarly: false,
            })
            await signIn({
                email: data.email,
                password: data.password
            }) 
            
        } catch(err) {
            const errors = getValidationErros(err)
            
            formRef.current?.setErrors(errors)
            Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login, cheque as credenciais')
        }
    },[signIn])

    return (
        <>
            <KeyboardAvoidingView style={{flex: 1}} enabled behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flex:1}} >
                <Container>
                    <Image source={logoIgm} />
                    <View>
                    <Title> Faça seu logon </Title>
                    </View>
                    <Form ref={formRef} style={{width: '100%'}} onSubmit={handleSignIn} >
                    <Input returnKeyType="next" onSubmitEditing={()=> passwordRef.current?.focus()} keyboardType="email-address" autoCorrect={false} autoCapitalize="none" name="email" icon="mail" placeholder="E-mail" />
                    <Input ref={passwordRef} returnKeyType="send" onSubmitEditing={() => formRef.current?.submitForm()} secureTextEntry name="password" icon="lock" placeholder="Senha" />
                    <Button onPress={() => formRef.current?.submitForm() } >Entrar</Button>
                    </Form>
                    <ForgotPassword>
                        <ForgotPasswordText> Esqueci minha senha </ForgotPasswordText>
                    </ForgotPassword>

                </Container>
            </ScrollView>
            </KeyboardAvoidingView>                    
            <CreateAccountButton onPress={()=> navigation.navigate('SignUp') } >
                <Icon name="log-in" size={20} color="#ff9000" />
                <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
            </CreateAccountButton>
        </>
    )
}

export default SignIn