/**
 * DrawDiary 색상 상수
 * iOS Human Interface Guidelines 기반
 */

export const Colors = {
  // Primary
  primary: '#007AFF', // iOS Blue

  // Light Mode
  light: {
    background: '#FFFFFF',
    secondaryBackground: '#F2F2F7',
    tertiaryBackground: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: 'rgba(60, 60, 67, 0.6)',
    separator: '#C6C6C8',
    link: '#007AFF',
  },

  // Dark Mode
  dark: {
    background: '#000000',
    secondaryBackground: '#1C1C1E',
    tertiaryBackground: '#2C2C2E',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(235, 235, 245, 0.6)',
    separator: '#38383A',
    link: '#0A84FF',
  },

  // Semantic Colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',

  // Mood Colors (감정 태그용)
  mood: {
    happy: '#FFD60A',      // 😊
    sad: '#64D2FF',        // 😢
    angry: '#FF453A',      // 😡
    tired: '#BF5AF2',      // 😴
    cool: '#32D74B',       // 😎
  },
};
