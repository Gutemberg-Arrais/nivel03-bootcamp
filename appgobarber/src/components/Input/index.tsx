import React, {useRef, useEffect, useImperativeHandle, forwardRef, useState, useCallback} from 'react'
import { useField } from '@unform/core'

import { TextInputProps, Text } from 'react-native'

import {Container, Icon, TextInput} from './styles'

interface InputProps extends TextInputProps {
    name: string;
    icon: string;
}

interface InputValueReference {
    value: string
}

interface InputRef {
    focus(): void
}

const Input: React.ForwardRefRenderFunction< InputRef ,InputProps> = ({icon, name, ...rest}, ref) => {
    const inputElementRef = useRef<any>(null)
    const { fieldName, registerField, defaultValue = '', error } = useField(name)
    const inputValueRef = useRef<InputValueReference>({value: defaultValue})

    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)

    const handleInputFocus = useCallback(() => {
        setIsFocused(true)
    }, [])

    const handleInputBlur = useCallback(() => {
        setIsFocused(false)

        setIsFilled(!!inputValueRef.current.value)

    }, [])
 
    useImperativeHandle(ref, () => ({
        focus() {
            inputElementRef.current.focus()
        }
    }))

    useEffect(() => {
        registerField<string>({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            clearValue() {
                inputValueRef.current.value = ''
                inputElementRef.current.clear()
            },
            setValue(_: any, value: string) {
                inputValueRef.current.value = value;
                inputElementRef.current.setNativeProps({text: value})
            },   
        })
    }, [fieldName, registerField])

    return (
    <Container isErrored={!!error} isFocused={isFocused} >
        <Icon name={icon} size={20} color={ isFocused || isFilled ? "#ff9000" : "#666360"} />
        <TextInput onFocus={handleInputFocus} onBlur={handleInputBlur} ref={inputElementRef} defaultValue={defaultValue} onChangeText={(value) => inputValueRef.current.value = value } keyboardAppearance="dark" placeholder="#666360" {...rest} />
      
    </Container>
    )
}

export default forwardRef(Input)