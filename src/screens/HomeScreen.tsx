/**
 * 홈 화면
 * 캘린더 뷰, 타임라인 뷰, 검색 기능
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { useDiary } from '../contexts/DiaryContext';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';
import { ViewMode } from '../types';
import { formatDisplayDate, getTodayString } from '../utils/date';
import { Calendar } from 'react-native-calendars';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const { entries } = useDiary();
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={() => setSearchMode(!searchMode)}>
            <Text style={{ fontSize: 20 }}>{searchMode ? '✕' : '🔍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={{ fontSize: 20 }}>⚙️</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, searchMode]);

  // 캘린더에 표시할 마크
  const markedDates = entries.reduce((acc, entry) => {
    acc[entry.date] = {
      marked: true,
      dotColor: Colors.primary,
      selectedColor: Colors.primary,
    };
    return acc;
  }, {} as any);

  // 검색 결과
  const searchResults = entries.filter(entry =>
    entry.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 타임라인용 정렬된 일기
  const displayEntries = searchMode && searchQuery
    ? [...searchResults].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDateSelect = (date: string) => {
    const entry = entries.find(e => e.date === date);
    if (entry) {
      navigation.navigate('DiaryView', { entryId: entry.id });
    } else {
      navigation.navigate('DiaryEdit', { date });
    }
  };

  const handleEntryPress = (entryId: string) => {
    navigation.navigate('DiaryView', { entryId });
  };

  const handleNewEntry = () => {
    navigation.navigate('DiaryEdit', { date: getTodayString() });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 검색 바 */}
      {searchMode && (
        <View style={[styles.searchContainer, { backgroundColor: theme.secondaryBackground }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="일기 검색..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearButton, { color: theme.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 검색 모드가 아닐 때만 탭 표시 */}
      {!searchMode && (
        <View style={[styles.tabContainer, { backgroundColor: theme.secondaryBackground }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              viewMode === 'calendar' && {
                backgroundColor: theme.background,
                ...Layout.shadow.small,
              },
            ]}
            onPress={() => setViewMode('calendar')}>
            <Text
              style={[
                styles.tabText,
                {
                  color: viewMode === 'calendar' ? theme.textPrimary : theme.textSecondary,
                },
              ]}>
              캘린더
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              viewMode === 'timeline' && {
                backgroundColor: theme.background,
                ...Layout.shadow.small,
              },
            ]}
            onPress={() => setViewMode('timeline')}>
            <Text
              style={[
                styles.tabText,
                {
                  color: viewMode === 'timeline' ? theme.textPrimary : theme.textSecondary,
                },
              ]}>
              타임라인
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 검색 결과 또는 캘린더/타임라인 */}
      {searchMode ? (
        <View style={styles.content}>
          {searchQuery ? (
            <FlatList
              data={displayEntries}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.timelineContainer}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.entryCard,
                    { backgroundColor: theme.secondaryBackground },
                    Layout.shadow.small,
                  ]}
                  onPress={() => handleEntryPress(item.id)}>
                  <View style={styles.entryHeader}>
                    <Text style={[styles.entryDate, { color: theme.textSecondary }]}>
                      {formatDisplayDate(item.date)}
                    </Text>
                    <Text style={styles.entryMood}>{item.mood}</Text>
                  </View>
                  <Text
                    style={[styles.entryText, { color: theme.textPrimary }]}
                    numberOfLines={2}>
                    {item.text}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    "{searchQuery}" 검색 결과가 없습니다
                  </Text>
                </View>
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                검색어를 입력하세요
              </Text>
            </View>
          )}
        </View>
      ) : (
        <>
          {/* 캘린더 뷰 */}
          {viewMode === 'calendar' && (
            <View style={styles.calendarContainer}>
              <Calendar
                markedDates={markedDates}
                onDayPress={day => handleDateSelect(day.dateString)}
                theme={{
                  backgroundColor: theme.background,
                  calendarBackground: theme.background,
                  textSectionTitleColor: theme.textSecondary,
                  selectedDayBackgroundColor: Colors.primary,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: Colors.primary,
                  dayTextColor: theme.textPrimary,
                  textDisabledColor: theme.textSecondary,
                  monthTextColor: theme.textPrimary,
                  textMonthFontWeight: '600',
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                }}
              />
            </View>
          )}

          {/* 타임라인 뷰 */}
          {viewMode === 'timeline' && (
            <FlatList
              data={displayEntries}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.timelineContainer}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.entryCard,
                    { backgroundColor: theme.secondaryBackground },
                    Layout.shadow.small,
                  ]}
                  onPress={() => handleEntryPress(item.id)}>
                  <View style={styles.entryHeader}>
                    <Text style={[styles.entryDate, { color: theme.textSecondary }]}>
                      {formatDisplayDate(item.date)}
                    </Text>
                    <Text style={styles.entryMood}>{item.mood}</Text>
                  </View>
                  <Text
                    style={[styles.entryText, { color: theme.textPrimary }]}
                    numberOfLines={2}>
                    {item.text}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    아직 작성한 일기가 없습니다
                  </Text>
                  <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                    오늘의 하루를 기록해보세요
                  </Text>
                </View>
              }
            />
          )}
        </>
      )}

      {/* 새 일기 버튼 */}
      {!searchMode && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: Colors.primary }]}
          onPress={handleNewEntry}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  searchIcon: {
    fontSize: 20,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    paddingVertical: Layout.spacing.sm,
  },
  clearButton: {
    ...Typography.title2,
    paddingHorizontal: Layout.spacing.sm,
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    margin: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.sm,
  },
  tabText: {
    ...Typography.callout,
    fontWeight: '600',
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: Layout.spacing.md,
  },
  timelineContainer: {
    padding: Layout.spacing.md,
  },
  entryCard: {
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.md,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  entryDate: {
    ...Typography.subhead,
  },
  entryMood: {
    fontSize: 24,
  },
  entryText: {
    ...Typography.body,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    ...Typography.headline,
    marginBottom: Layout.spacing.sm,
  },
  emptySubtext: {
    ...Typography.subhead,
  },
  fab: {
    position: 'absolute',
    right: Layout.spacing.md,
    bottom: Layout.spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Layout.shadow.large,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
  },
});

export default HomeScreen;
