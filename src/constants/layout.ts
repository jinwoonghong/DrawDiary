/**
 * DrawDiary 레이아웃 상수
 * iOS Human Interface Guidelines 기반
 */

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  window: {
    width,
    height,
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  // Border Radius
  borderRadius: {
    sm: 8,
    md: 10,
    lg: 12,
    xl: 20,
    round: 9999,
  },

  // Shadow (iOS 스타일)
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },

  // Animation Duration
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};
