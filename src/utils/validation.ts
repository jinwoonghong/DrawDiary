/**
 * 유효성 검사 유틸리티 함수
 */

import { MoodType } from '../types';

const MAX_TEXT_LENGTH = 150;

/**
 * 일기 텍스트 유효성 검사
 */
export const validateDiaryText = (text: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: '일기 내용을 입력해주세요.' };
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return {
      isValid: false,
      error: `일기는 최대 ${MAX_TEXT_LENGTH}자까지 입력 가능합니다.`,
    };
  }

  return { isValid: true };
};

/**
 * 감정 선택 유효성 검사
 */
export const validateMood = (mood: string): mood is MoodType => {
  const validMoods: MoodType[] = ['😊', '😢', '😡', '😴', '😎'];
  return validMoods.includes(mood as MoodType);
};

/**
 * 남은 글자 수 계산
 */
export const getRemainingChars = (text: string): number => {
  return MAX_TEXT_LENGTH - text.length;
};

/**
 * 텍스트가 제한을 초과했는지 확인
 */
export const isTextOverLimit = (text: string): boolean => {
  return text.length > MAX_TEXT_LENGTH;
};
