/**
 * 일기 상세 보기 화면
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDiary } from '../contexts/DiaryContext';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';
import { formatDisplayDate } from '../utils/date';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'DiaryView'>;

const DiaryViewScreen: React.FC<Props> = ({ navigation, route }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const { getEntry, deleteEntry } = useDiary();

  const entryId = route.params.entryId;
  const entry = getEntry(entryId);

  useEffect(() => {
    if (!entry) {
      Alert.alert('오류', '일기를 찾을 수 없습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
      return;
    }

    // 헤더 오른쪽 버튼들
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={handleEdit}>
            <Text style={{ color: Colors.primary, fontSize: 17 }}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={{ color: Colors.error, fontSize: 17 }}>삭제</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, entry]);

  const handleEdit = () => {
    navigation.navigate('DiaryEdit', { entryId });
  };

  const handleDelete = () => {
    Alert.alert(
      '일기 삭제',
      '정말 이 일기를 삭제하시겠습니까? 삭제된 일기는 복구할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(entryId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('삭제 실패', '일기를 삭제하는데 실패했습니다.');
            }
          },
        },
      ],
    );
  };

  if (!entry) {
    return null;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}>
      {/* 날짜 */}
      <Text style={[styles.date, { color: theme.textSecondary }]}>
        {formatDisplayDate(entry.date)}
      </Text>

      {/* 감정 */}
      <View style={styles.moodContainer}>
        <Text style={styles.moodEmoji}>{entry.mood}</Text>
      </View>

      {/* 텍스트 */}
      <View
        style={[
          styles.textContainer,
          { backgroundColor: theme.secondaryBackground },
        ]}>
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          {entry.text}
        </Text>
      </View>

      {/* 이미지 */}
      {entry.imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: entry.imageUri }} style={styles.image} />
        </View>
      )}

      {/* 메타 정보 */}
      <View style={styles.metaContainer}>
        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
          작성일: {new Date(entry.createdAt).toLocaleString('ko-KR')}
        </Text>
        {entry.updatedAt !== entry.createdAt && (
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            수정일: {new Date(entry.updatedAt).toLocaleString('ko-KR')}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Layout.spacing.md,
  },
  date: {
    ...Typography.headline,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  moodContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  moodEmoji: {
    fontSize: 64,
  },
  textContainer: {
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.lg,
  },
  text: {
    ...Typography.body,
    lineHeight: 24,
  },
  imageContainer: {
    marginBottom: Layout.spacing.lg,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: Layout.borderRadius.md,
    resizeMode: 'cover',
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.separator,
    paddingTop: Layout.spacing.md,
  },
  metaText: {
    ...Typography.caption1,
    marginBottom: Layout.spacing.xs,
  },
});

export default DiaryViewScreen;
