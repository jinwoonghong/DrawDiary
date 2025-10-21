/**
 * 앱 네비게이션 설정
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Colors } from '../constants/colors';
import { useColorScheme } from 'react-native';

// 화면 import (나중에 구현)
import HomeScreen from '../screens/HomeScreen';
import DiaryEditScreen from '../screens/DiaryEditScreen';
import DiaryViewScreen from '../screens/DiaryViewScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
            shadowColor: 'transparent', // iOS 그림자 제거
            elevation: 0, // Android 그림자 제거
          },
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
            color: theme.textPrimary,
          },
          headerBackTitleVisible: false,
          cardStyle: {
            backgroundColor: theme.background,
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: 'DrawDiary',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="DiaryEdit"
          component={DiaryEditScreen}
          options={({ route }) => ({
            headerTitle: route.params?.entryId ? '일기 수정' : '새 일기',
            presentation: 'modal',
          })}
        />
        <Stack.Screen
          name="DiaryView"
          component={DiaryViewScreen}
          options={{
            headerTitle: '일기',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
