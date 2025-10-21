/**
 * 일기 작성/수정 화면
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useDiary } from '../contexts/DiaryContext';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';
import { MoodType } from '../types';
import { validateDiaryText, getRemainingChars } from '../utils/validation';
import { getTodayString } from '../utils/date';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'DiaryEdit'>;

const MOODS: MoodType[] = ['😊', '😢', '😡', '😴', '😎'];

const DiaryEditScreen: React.FC<Props> = ({ navigation, route }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const { getEntry, addEntry, updateEntry } = useDiary();

  const entryId = route.params?.entryId;
  const initialDate = route.params?.date || getTodayString();
  const existingEntry = entryId ? getEntry(entryId) : undefined;

  const [mood, setMood] = useState<MoodType>(existingEntry?.mood || '😊');
  const [text, setText] = useState(existingEntry?.text || '');
  const [imageUri, setImageUri] = useState(existingEntry?.imageUri);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 헤더 오른쪽에 저장 버튼
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={{ color: Colors.primary, fontSize: 17, fontWeight: '600' }}>
            {saving ? '저장 중...' : '저장'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, mood, text, imageUri, saving]);

  const handleSave = async () => {
    // 유효성 검사
    const validation = validateDiaryText(text);
    if (!validation.isValid) {
      Alert.alert('입력 오류', validation.error);
      return;
    }

    try {
      setSaving(true);

      if (entryId) {
        // 수정
        await updateEntry(entryId, {
          mood,
          text,
          imageUri,
          imageType: imageUri ? 'photo' : undefined,
        });
      } else {
        // 새로 작성
        await addEntry({
          date: initialDate,
          mood,
          text,
          imageUri,
          imageType: imageUri ? 'photo' : undefined,
        });
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('저장 실패', '일기를 저장하는데 실패했습니다.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = () => {
    Alert.alert(
      '이미지 선택',
      '사진을 추가할 방법을 선택하세요',
      [
        {
          text: '카메라',
          onPress: () => {
            launchCamera({ mediaType: 'photo', quality: 0.8 }, response => {
              if (response.assets && response.assets[0]) {
                setImageUri(response.assets[0].uri);
              }
            });
          },
        },
        {
          text: '갤러리',
          onPress: () => {
            launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
              if (response.assets && response.assets[0]) {
                setImageUri(response.assets[0].uri);
              }
            });
          },
        },
        { text: '취소', style: 'cancel' },
      ],
    );
  };

  const handleRemoveImage = () => {
    setImageUri(undefined);
  };

  const remainingChars = getRemainingChars(text);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      keyboardShouldPersistTaps="handled">
      {/* 감정 선택 */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          오늘의 기분
        </Text>
        <View style={styles.moodContainer}>
          {MOODS.map(m => (
            <TouchableOpacity
              key={m}
              style={[
                styles.moodButton,
                mood === m && {
                  backgroundColor: Colors.primary + '20',
                  borderColor: Colors.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setMood(m)}>
              <Text style={styles.moodEmoji}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 텍스트 입력 */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          오늘의 이야기
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.secondaryBackground,
              color: theme.textPrimary,
            },
          ]}
          placeholder="오늘 하루는 어땠나요? (최대 150자)"
          placeholderTextColor={theme.textSecondary}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={150}
          textAlignVertical="top"
        />
        <Text
          style={[
            styles.charCount,
            {
              color: remainingChars < 20 ? Colors.warning : theme.textSecondary,
            },
          ]}>
          {remainingChars}자 남음
        </Text>
      </View>

      {/* 이미지 추가 */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          그림 추가 (선택)
        </Text>
        {imageUri ? (
          <View>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity
              style={[styles.removeImageButton, { backgroundColor: Colors.error }]}
              onPress={handleRemoveImage}>
              <Text style={styles.removeImageText}>이미지 제거</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageButtonContainer}>
            <TouchableOpacity
              style={[styles.imageButton, { backgroundColor: theme.secondaryBackground }]}
              onPress={handlePickImage}>
              <Text style={styles.imageButtonIcon}>📷</Text>
              <Text style={[styles.imageButtonText, { color: theme.textPrimary }]}>
                사진 추가
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.separator,
  },
  label: {
    ...Typography.headline,
    marginBottom: Layout.spacing.md,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.secondaryBackground,
  },
  moodEmoji: {
    fontSize: 32,
  },
  textInput: {
    ...Typography.body,
    height: 200,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  charCount: {
    ...Typography.caption1,
    textAlign: 'right',
    marginTop: Layout.spacing.sm,
  },
  imageButtonContainer: {
    alignItems: 'center',
  },
  imageButton: {
    width: '100%',
    height: 120,
    borderRadius: Layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.separator,
    borderStyle: 'dashed',
  },
  imageButtonIcon: {
    fontSize: 40,
    marginBottom: Layout.spacing.sm,
  },
  imageButtonText: {
    ...Typography.callout,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: Layout.borderRadius.md,
    resizeMode: 'cover',
  },
  removeImageButton: {
    marginTop: Layout.spacing.md,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  removeImageText: {
    ...Typography.callout,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default DiaryEditScreen;
