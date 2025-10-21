/**
 * 스케치 화면
 * react-native-signature-canvas 사용
 */

import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  useColorScheme,
  Alert,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type SketchScreenParams = {
  onSave: (uri: string) => void;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Sketch'>;

const SketchScreen: React.FC<Props> = ({ navigation, route }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const signatureRef = useRef<any>(null);
  const { onSave } = route.params as SketchScreenParams;

  const handleSave = (signature: string) => {
    if (signature) {
      // Base64 이미지를 URI로 변환
      const imageUri = signature;
      onSave(imageUri);
      navigation.goBack();
    }
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleUndo = () => {
    signatureRef.current?.undo();
  };

  const handleConfirm = () => {
    signatureRef.current?.readSignature();
  };

  const handleEmpty = () => {
    Alert.alert('알림', '그림을 그려주세요.');
  };

  const webStyle = `
    .m-signature-pad {
      box-shadow: none;
      border: none;
      background-color: ${theme.background};
    }
    .m-signature-pad--body {
      border: none;
    }
    .m-signature-pad--footer {
      display: none;
    }
    body,html {
      width: 100%;
      height: 100%;
      background-color: ${theme.background};
    }
  `;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SignatureCanvas
        ref={signatureRef}
        onOK={handleSave}
        onEmpty={handleEmpty}
        descriptionText=""
        clearText="지우기"
        confirmText="확인"
        webStyle={webStyle}
        autoClear={false}
        imageType="image/png"
      />

      <View style={[styles.controls, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.secondaryBackground }]}
          onPress={handleUndo}>
          <Text style={[styles.buttonText, { color: theme.textPrimary }]}>
            ↩ 실행 취소
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.secondaryBackground }]}
          onPress={handleClear}>
          <Text style={[styles.buttonText, { color: Colors.error }]}>
            🗑 전체 지우기
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.primary }]}
          onPress={handleConfirm}>
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
            ✓ 완료
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.separator,
  },
  button: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.callout,
    fontWeight: '600',
  },
});

export default SketchScreen;
