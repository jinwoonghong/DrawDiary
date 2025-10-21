/**
 * 설정 화면
 * 데이터 백업/복구, 앱 정보
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import { useDiary } from '../contexts/DiaryContext';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import * as storage from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const { entries, refreshEntries } = useDiary();

  const handleExportData = async () => {
    try {
      if (entries.length === 0) {
        Alert.alert('알림', '내보낼 일기가 없습니다.');
        return;
      }

      // JSON 데이터 생성
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        totalEntries: entries.length,
        entries,
      };

      const jsonString = JSON.stringify(exportData, null, 2);

      // 콘솔에 출력 (개발 중)
      console.log('Export Data:', jsonString);

      Alert.alert(
        '내보내기',
        `${entries.length}개의 일기를 내보냈습니다.\n\n파일 공유 기능은 추후 업데이트 예정입니다.`,
      );
    } catch (error) {
      console.error(error);
      Alert.alert('내보내기 실패', '데이터를 내보내는데 실패했습니다.');
    }
  };

  const handleImportData = () => {
    Alert.alert(
      '데이터 가져오기',
      '파일 선택 및 가져오기 기능은 추후 업데이트 예정입니다.\n\n현재는 앱 삭제 전 데이터 백업을 위해 iOS iCloud 또는 Android 자동 백업을 사용해주세요.',
      [{ text: '확인' }],
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      '모든 데이터 삭제',
      `정말 모든 일기(${entries.length}개)를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.clearAllData();
              await refreshEntries();
              Alert.alert('삭제 완료', '모든 일기가 삭제되었습니다.');
              navigation.goBack();
            } catch (error) {
              Alert.alert('삭제 실패', '데이터를 삭제하는데 실패했습니다.');
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}>
      {/* 데이터 관리 섹션 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          데이터 관리
        </Text>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.secondaryBackground }]}
          onPress={handleExportData}>
          <Text style={styles.menuIcon}>📤</Text>
          <View style={styles.menuContent}>
            <Text style={[styles.menuTitle, { color: theme.textPrimary }]}>
              데이터 내보내기
            </Text>
            <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
              모든 일기를 JSON 형식으로 확인
            </Text>
          </View>
          <Text style={[styles.menuArrow, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.secondaryBackground }]}
          onPress={handleImportData}>
          <Text style={styles.menuIcon}>📥</Text>
          <View style={styles.menuContent}>
            <Text style={[styles.menuTitle, { color: theme.textPrimary }]}>
              데이터 가져오기
            </Text>
            <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
              백업 파일에서 일기 복원 (준비 중)
            </Text>
          </View>
          <Text style={[styles.menuArrow, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 앱 정보 섹션 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          앱 정보
        </Text>

        <View style={[styles.infoItem, { backgroundColor: theme.secondaryBackground }]}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            작성한 일기
          </Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
            {entries.length}개
          </Text>
        </View>

        <View style={[styles.infoItem, { backgroundColor: theme.secondaryBackground }]}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            버전
          </Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
            1.0.0 MVP
          </Text>
        </View>

        <View style={[styles.infoItem, { backgroundColor: theme.secondaryBackground }]}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            저장 방식
          </Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
            100% 로컬
          </Text>
        </View>

        <View style={[styles.infoItem, { backgroundColor: theme.secondaryBackground }]}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            자동 백업
          </Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
            iCloud / Google Drive
          </Text>
        </View>
      </View>

      {/* 위험 섹션 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.error }]}>
          위험
        </Text>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.secondaryBackground }]}
          onPress={handleClearAllData}>
          <Text style={styles.menuIcon}>🗑️</Text>
          <View style={styles.menuContent}>
            <Text style={[styles.menuTitle, { color: Colors.error }]}>
              모든 데이터 삭제
            </Text>
            <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
              복구할 수 없습니다
            </Text>
          </View>
          <Text style={[styles.menuArrow, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 개발자 정보 */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          DrawDiary v1.0.0
        </Text>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          하루를 2~3문장과 그림으로
        </Text>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Made with ❤️ by Claude Code
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: Layout.spacing.xl,
  },
  section: {
    marginTop: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
  },
  sectionTitle: {
    ...Typography.title3,
    marginBottom: Layout.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: Layout.spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    ...Typography.caption1,
  },
  menuArrow: {
    fontSize: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
  },
  infoLabel: {
    ...Typography.body,
  },
  infoValue: {
    ...Typography.body,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: Layout.spacing.xl,
    gap: Layout.spacing.xs,
  },
  footerText: {
    ...Typography.caption1,
  },
});

export default SettingsScreen;
