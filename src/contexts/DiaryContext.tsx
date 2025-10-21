/**
 * DiaryContext
 * 일기 데이터 전역 상태 관리
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { DiaryEntry, CreateDiaryDTO, UpdateDiaryDTO } from '../types';
import * as storage from '../utils/storage';

interface DiaryContextType {
  entries: DiaryEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (dto: CreateDiaryDTO) => Promise<void>;
  updateEntry: (id: string, dto: UpdateDiaryDTO) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntry: (id: string) => DiaryEntry | undefined;
  getEntryByDate: (date: string) => DiaryEntry | undefined;
  getEntriesByMonth: (year: number, month: number) => DiaryEntry[];
  refreshEntries: () => Promise<void>;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within DiaryProvider');
  }
  return context;
};

interface DiaryProviderProps {
  children: ReactNode;
}

export const DiaryProvider: React.FC<DiaryProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 앱 시작 시 일기 데이터 로드
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storage.loadEntries();
      setEntries(data);
    } catch (err) {
      setError('일기를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (dto: CreateDiaryDTO) => {
    try {
      setError(null);
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        ...dto,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await storage.addEntry(newEntry);
      setEntries(prev => [...prev, newEntry]);
    } catch (err) {
      setError('일기를 저장하는데 실패했습니다.');
      console.error(err);
      throw err;
    }
  };

  const updateEntryFunc = async (id: string, dto: UpdateDiaryDTO) => {
    try {
      setError(null);
      await storage.updateEntry(id, dto);
      setEntries(prev =>
        prev.map(entry =>
          entry.id === id
            ? { ...entry, ...dto, updatedAt: Date.now() }
            : entry,
        ),
      );
    } catch (err) {
      setError('일기를 수정하는데 실패했습니다.');
      console.error(err);
      throw err;
    }
  };

  const deleteEntryFunc = async (id: string) => {
    try {
      setError(null);
      await storage.deleteEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (err) {
      setError('일기를 삭제하는데 실패했습니다.');
      console.error(err);
      throw err;
    }
  };

  const getEntry = (id: string): DiaryEntry | undefined => {
    return entries.find(entry => entry.id === id);
  };

  const getEntryByDate = (date: string): DiaryEntry | undefined => {
    return entries.find(entry => entry.date === date);
  };

  const getEntriesByMonth = (year: number, month: number): DiaryEntry[] => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    return entries.filter(entry => entry.date.startsWith(monthStr));
  };

  const refreshEntries = async () => {
    await loadEntries();
  };

  const value: DiaryContextType = {
    entries,
    loading,
    error,
    addEntry,
    updateEntry: updateEntryFunc,
    deleteEntry: deleteEntryFunc,
    getEntry,
    getEntryByDate,
    getEntriesByMonth,
    refreshEntries,
  };

  return (
    <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>
  );
};
