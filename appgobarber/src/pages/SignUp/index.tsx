import React, {useRef, useCallback} from 'react'
import * as Yup from 'yup'
import { useNavigation } from '@react-navigation/native'
import {Image, TextInput ,ScrollView ,KeyboardAvoidingView, Platform, View, Alert} from 'react-native'
import Input from '../../components/Input'
import Button from '../../components/Button'
import logoIgm from '../../assets/logo.png'
import api from '../../services/api'

import getValidationErros from '../../utils/getValidationErrors'

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'


import Icon from 'react-native-vector-icons/Feather'

import { Container, Title, BackToSignIn, BackToSignInText } from './styles'

interface signUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const navigation = useNavigation()
    const formRef = useRef<FormHandles>(null)
    const emailInputRef = useRef<TextInput>(null)
    const passwordInputRef = useRef<TextInput>(null)

    const handleSignUp = useCallback(async (data: signUpFormData) => {
        try {
            console.log('1')
            formRef.current?.setErrors({})

            const schema = Yup.object().shape({
                name: Yup.string().required('Nome Obrigatório'),
                email: Yup.string().required('E-mail Obrigatório').email('Digite um E-mail válido'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos')
            })

            await schema.validate(data, {
                abortEarly: false,
            })

            await api.post('/users', data)

            Alert.alert('Cadastro realizado com sucesso!', 'Você já pode fazer o login na aplicação')

            navigation.goBack()
        } catch(err) {
            const errors = getValidationErros(err)

            formRef.current?.setErrors(errors)

            Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login, cheque as credenciais')
        }
    },[navigation])

    return (
        <>
                <KeyboardAvoidingView style={{flex: 1}} enabled behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flex:1}} >
                    <Container>
                        <Image source={logoIgm} />
                        <View>
                        <Title> Crie sua conta </Title>
                        </View>
                        <Form onSubmit={handleSignUp} style={{width: '100%'}} ref={formRef} >
                        <Input onSubmitEditing={()=> emailInputRef.current?.focus()} returnKeyType="next" autoCapitalize="words" name="name" icon="user" placeholder="Nome" />
                        <Input ref={emailInputRef} onSubmitEditing={() => passwordInputRef.current?.focus() } returnKeyType="next" keyboardType="email-address" autoCorrect={false} autoCapitalize="none" name="email" icon="mail" placeholder="E-mail" />
                        <Input ref={passwordInputRef} onSubmitEditing={() => formRef.current?.submitForm() } secureTextEntry textContentType="newPassword" name="password" icon="lock" placeholder="Senha" />
                        <Button onPress={() => formRef.current?.submitForm()} >Entrar</Button>
                        </Form>
                    </Container>
                </ScrollView>
                </KeyboardAvoidingView>                    
            <BackToSignIn onPress={() => navigation.goBack()} >
                <Icon name="arrow-left" size={20} color="#fff" />
                <BackToSignInText>Voltar para logon</BackToSignInText>
            </BackToSignIn>
        </>
    )
}

export default SignIn