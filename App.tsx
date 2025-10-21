/**
 * DrawDiary App
 * 그림일기 모바일 앱
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { DiaryProvider } from './src/contexts/DiaryContext';
import AppNavigator from './src/navigation/AppNavigator';
import 'react-native-gesture-handler';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <DiaryProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </DiaryProvider>
  );
}

export default App;
