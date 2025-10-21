/**
 * DrawDiary App
 * 그림일기 모바일 앱
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { DiaryProvider } from './src/contexts/DiaryContext';
import { Colors } from './src/constants/colors';
import { Typography } from './src/constants/typography';

function AppContent(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          DrawDiary
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          하루를 2~3문장과 그림으로 기록하세요
        </Text>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>😊 😢 😡 😴 😎</Text>
        </View>
        <Text style={[styles.info, { color: theme.textSecondary }]}>
          개발 진행 중...
        </Text>
      </View>
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  return (
    <DiaryProvider>
      <AppContent />
    </DiaryProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    ...Typography.largeTitle,
    marginBottom: 12,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: 40,
  },
  emojiContainer: {
    marginBottom: 60,
  },
  emoji: {
    fontSize: 48,
    letterSpacing: 8,
  },
  info: {
    ...Typography.footnote,
  },
});

export default App;
