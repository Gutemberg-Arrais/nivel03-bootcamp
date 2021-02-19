import React from 'react' 
import {View, Text, Button} from 'react-native'

import { useAuth } from '../../hooks/auth'

const DashBoard: React.FC = () => {
    const { signOut } = useAuth();
    return (
        <View style={{flex: 1 ,justifyContent: 'center', alignItems: 'center'}} >
            <Text>Autenticado</Text>
            <Button title="Sair" onPress={signOut} />
        </View>
    )
}

export default DashBoard

