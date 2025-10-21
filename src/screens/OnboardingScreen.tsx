/**
 * 온보딩 화면
 * 첫 실행 시 사용법 안내
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const ONBOARDING_KEY = 'hasSeenOnboarding';

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      emoji: '✍️',
      title: 'DrawDiary에 오신 것을 환영합니다',
      description: '하루를 2~3문장과 그림으로\n간단하게 기록하세요',
    },
    {
      emoji: '😊',
      title: '감정과 함께 기록하세요',
      description: '5가지 감정 이모지로\n오늘의 기분을 표현할 수 있어요',
    },
    {
      emoji: '🎨',
      title: '사진 또는 스케치 추가',
      description: '카메라로 찍거나 갤러리에서 선택하거나\n직접 그림을 그려보세요',
    },
    {
      emoji: '🔒',
      title: '100% 로컬 저장',
      description: '모든 일기는 디바이스에만 저장되며\n서버로 전송되지 않아요',
    },
  ];

  const handleNext = async () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      onComplete();
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    onComplete();
  };

  const currentPageData = pages[currentPage];
  const isLastPage = currentPage === pages.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 스킵 버튼 */}
      {!isLastPage && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: Colors.primary }]}>건너뛰기</Text>
        </TouchableOpacity>
      )}

      {/* 콘텐츠 */}
      <View style={styles.content}>
        <Text style={styles.emoji}>{currentPageData.emoji}</Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {currentPageData.title}
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {currentPageData.description}
        </Text>
      </View>

      {/* 페이지 인디케이터 */}
      <View style={styles.pagination}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentPage
                ? { backgroundColor: Colors.primary }
                : { backgroundColor: theme.textSecondary, opacity: 0.3 },
            ]}
          />
        ))}
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: Colors.primary }]}
        onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {isLastPage ? '시작하기' : '다음'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: Layout.spacing.md,
    zIndex: 1,
    padding: Layout.spacing.sm,
  },
  skipText: {
    ...Typography.body,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
  },
  emoji: {
    fontSize: 120,
    marginBottom: Layout.spacing.xl,
  },
  title: {
    ...Typography.largeTitle,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  description: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    marginHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.xl,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  nextButtonText: {
    ...Typography.headline,
    color: '#FFFFFF',
  },
});

export default OnboardingScreen;
export { ONBOARDING_KEY };
