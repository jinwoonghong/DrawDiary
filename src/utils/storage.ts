/**
 * AsyncStorage 유틸리티 함수
 * 로컬 저장소 관리
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry } from '../types';

const STORAGE_KEY = 'diary_entries';

/**
 * 모든 일기 불러오기
 */
export const loadEntries = async (): Promise<DiaryEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load entries:', error);
    return [];
  }
};

/**
 * 모든 일기 저장하기
 */
export const saveEntries = async (entries: DiaryEntry[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save entries:', error);
    throw error;
  }
};

/**
 * 일기 추가
 */
export const addEntry = async (entry: DiaryEntry): Promise<void> => {
  const entries = await loadEntries();
  entries.push(entry);
  await saveEntries(entries);
};

/**
 * 일기 수정
 */
export const updateEntry = async (
  id: string,
  updates: Partial<DiaryEntry>,
): Promise<void> => {
  const entries = await loadEntries();
  const index = entries.findIndex(e => e.id === id);

  if (index === -1) {
    throw new Error('Entry not found');
  }

  entries[index] = {
    ...entries[index],
    ...updates,
    updatedAt: Date.now(),
  };

  await saveEntries(entries);
};

/**
 * 일기 삭제
 */
export const deleteEntry = async (id: string): Promise<void> => {
  const entries = await loadEntries();
  const filtered = entries.filter(e => e.id !== id);
  await saveEntries(filtered);
};

/**
 * ID로 일기 찾기
 */
export const getEntryById = async (
  id: string,
): Promise<DiaryEntry | undefined> => {
  const entries = await loadEntries();
  return entries.find(e => e.id === id);
};

/**
 * 날짜로 일기 찾기
 */
export const getEntryByDate = async (
  date: string,
): Promise<DiaryEntry | undefined> => {
  const entries = await loadEntries();
  return entries.find(e => e.date === date);
};

/**
 * 월별 일기 가져오기
 */
export const getEntriesByMonth = async (
  year: number,
  month: number,
): Promise<DiaryEntry[]> => {
  const entries = await loadEntries();
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  return entries.filter(e => e.date.startsWith(monthStr));
};

/**
 * 모든 데이터 삭제 (주의: 복구 불가)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear data:', error);
    throw error;
  }
};
