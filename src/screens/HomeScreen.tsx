/**
 * 홈 화면
 * 캘린더 뷰와 타임라인 뷰 전환
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  Pressable,
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

  // 캘린더에 표시할 마크
  const markedDates = entries.reduce((acc, entry) => {
    acc[entry.date] = {
      marked: true,
      dotColor: Colors.primary,
      selectedColor: Colors.primary,
    };
    return acc;
  }, {} as any);

  // 타임라인용 정렬된 일기
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

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
      {/* 뷰 모드 전환 탭 */}
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
          data={sortedEntries}
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

      {/* 새 일기 버튼 */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: Colors.primary }]}
        onPress={handleNewEntry}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
