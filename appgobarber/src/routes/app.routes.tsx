import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import DashBoard from '../pages/DashBoard'


const App = createStackNavigator()

const AppRoutes: React.FC = () => (
    <NavigationContainer>
        <App.Navigator screenOptions={{ headerShown: false, cardStyle:{backgroundColor: '#312e38'} }} >
            <App.Screen name="DashBoard" component={DashBoard} /> 
        </App.Navigator>
    </NavigationContainer>
)

export default AppRoutes