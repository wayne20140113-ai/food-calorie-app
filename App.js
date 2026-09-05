import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import ResultScreen from './src/screens/ResultScreen';
import { LogProvider } from './src/context/LogContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <LogProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: '今日熱量' }}
          />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ title: '拍攝食物' }}
          />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{ title: '確認熱量' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LogProvider>
  );
}
